export default async (req, res) => {
  switch (req.method) {
    case "GET":
      const { role, user_id } = req.headers;
      let kelas = [];
      switch (role) {
        case "admin":
          kelas = await queryAdmin();
          break;
        case "guru":
          kelas = await queryGuru(user_id);
          break;
        case "peserta":
          kelas = await queryPeserta(user_id);
          break;
        default:
          break;
      }
      res.json({ data: kelas });
      break;
    case "POST":
      //TODO: Insert into table kelas
      const { nama, durasi, deskripsi, waktu, hari, kapasitas, status } =
        req.body;
      console.log(req.body);
      res.json({
        message: "Berhasil menambahkan kelas baru!",
      });
      break;
    default:
      break;
  }
};

//TODO : Fetch kelas berdasarkan role
/* SELECT *
FROM kelas */
const queryAdmin = async () => [
  {
    id: "1",
    nama: "Sistem Informasi",
    durasi: "01:40:00",
    deskripsi:
      "Mata kuliah yang membahas cara pembuatan sistem informasi yang baik",
    waktu: "07:00:00",
    hari: "kamis",
    kapasitas: 40,
    status: "terbuka",
  },
  {
    id: "2",
    nama: "Sistem Basis Data",
    durasi: "01:40:00",
    deskripsi: "Dasar basis data, bahasan utamanya adalah SQL",
    waktu: "12:30:00",
    hari: "rabu",
    kapasitas: 50,
    status: "berjalan",
  },
  {
    id: "3",
    nama: "Teknik Mikroprosesor",
    durasi: "00:50:00",
    deskripsi: "Pengenalan MCU beserta pengalamatan",
    waktu: "16:00:00",
    hari: "selasa",
    kapasitas: 60,
    status: "selesai",
  },
];

/* SELECT k.nama, k.hari, k.waktu
as waktu_mulai,
ADDTIME(k.waktu, k.durasi) as
waktu_akhir
FROM kelas AS k
INNER JOIN mengikuti AS m
ON k.id = m.kelas_id
WHERE m.guru_id = ${user_id}
GROUP BY k.id */
const queryGuru = async (user_id) => [
  {
    nama: "Sistem Informasi",
    hari: "kamis",
    waktu_mulai: "07:00:00",
    waktu_akhir: "08:40:00",
  },
  {
    nama: "Sistem Basis Data",
    hari: "rabu",
    waktu_mulai: "12:30:00",
    waktu_akhir: "14:10:00",
  },
  {
    nama: "Teknik Mikroprosesor",
    hari: "selasa",
    waktu_mulai: "16:00:00",
    waktu_akhir: "16:50:00",
  },
];

/* SELECT nama,
hari, waktu AS waktu_mulai,
ADDTIME(waktu, durasi) AS
waktu_akhir,
IF(EXISTS(SELECT id FROM
mengikuti WHERE peserta_id =
${user_id} AND kelas_id =
kelas.id),'1', '0' ) AS
terambil
FROM kelas */
const queryPeserta = async (user_id) => [
  {
    nama: "Sistem Informasi",
    hari: "kamis",
    waktu_mulai: "07:00:00",
    waktu_akhir: "08:40:00",
    terambil: "0",
  },
  {
    nama: "Sistem Basis Data",
    hari: "rabu",
    waktu_mulai: "12:30:00",
    waktu_akhir: "14:10:00",
    terambil: "1",
  },
  {
    nama: "Teknik Mikroprosesor",
    hari: "selasa",
    waktu_mulai: "16:00:00",
    waktu_akhir: "16:50:00",
    terambil: "1",
  },
];
