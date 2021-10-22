export default async (req, res) => {
  const { kelas_id } = req.query;
  switch (req.method) {
    case "GET":
      const { role } = req.headers;
      let kelas = undefined;
      switch (role) {
        case "admin":
          kelas = await queryAdmin(kelas_id);
          break;
        case "guru":
          kelas = await queryGuru(kelas_id);
          break;
        case "peserta":
          const { user_id } = req.headers;
          kelas = await queryPeserta(kelas_id, user_id);
          break;
        default:
          break;
      }
      res.json({ ...kelas });
      break;
    case "PUT":
      //TODO: Admin ngubah kelas / assign guru ke kelas (?)
      const { nama, durasi, deskripsi, waktu, hari, kapasitas, status } =
        req.body;
      res.json({
        message: `Berhasil menambahkan kelas '${nama}'`,
      });
      break;
    case "DELETE":
      //TODO: Admin hapus kelas
      break;
    default:
      break;
  }
};

//TODO : Fetch kelas berdasarkan role
/* SELECT *
FROM kelas
WHERE id = ${kelas_id} */
//TODO : Tambahin query ngambil list guru yang keassign ke kelas ini
const queryAdmin = async (kelas_id) => ({
  id: `${kelas_id}`,
  nama: `Kelas Dengan ID ${kelas_id}`,
  durasi: "01:40:00",
  deskripsi: `Halo ${kelas_id}`,
  waktu: "07:00:00",
  hari: "kamis",
  kapasitas: 40,
  status: "terbuka",
  guru: [],
});

/* SELECT nama, durasi, deskripsi,
waktu, hari, kapasitas
FROM kelas
WHERE id = ${kelas_id} */
const queryGuru = async (kelas_id) => ({
  nama: `Kelas Dengan ID ${kelas_id}`,
  durasi: "01:40:00",
  deskripsi: `Halo ${kelas_id}`,
  waktu: "07:00:00",
  hari: "kamis",
  kapasitas: 40,
});

/* SELECT k.nama, k.durasi, k.deskripsi,
k.waktu, k.hari, k.kapasitas
AVG(m.nilai) as nilai
FROM kelas as k
INNER JOIN mengikuti AS m
ON m.kelas_id = k.id
WHERE k.id = ${kelas_id} AND
m.peserta_id = ${user_id}
GROUP BY k.id */
const queryPeserta = async (kelas_id, user_id) => ({
  nama: `Kelas Dengan ID ${kelas_id}`,
  durasi: "01:40:00",
  deskripsi: `Kelas ${kelas_id} untuk peserta ${user_id}`,
  waktu: "07:00:00",
  hari: "kamis",
  kapasitas: 40,
  nilai: 85,
});
