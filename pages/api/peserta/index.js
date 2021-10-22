export default async (req, res) => {
  switch (req.method) {
    case "GET":
      const { role } = req.headers;
      let users = [];
      switch (role) {
        case "peserta":
          users = await queryPesertaGuru();
          break;
        case "guru":
          users = await queryPesertaGuru();
          break;
        case "admin":
          users = await queryAdmin();
          break;
        default:
          break;
      }
      res.json({ data: users });
      break;
    case "POST":
      const { username, nama, password } = req.body;
      //TODO : Insert ke tabel peserta di DB
      res.json({
        message: "Pendaftaran akun peserta berhasil, silahkan login!",
      });
      break;
  }
};

//TODO : Fetch tabel peserta berdasarkan role
/* SELECT id, username, nama   !!!Ada tambahan ngambil kolom id, di proposal ngga ada
FROM peserta */
const queryAdmin = async () => [
  { id: "1", nama: "Peserta 1", username: "pst1" },
  { id: "2", nama: "Peserta 2", username: "pst2" },
  { id: "3", nama: "Peserta 3", username: "pst3" },
];

/* SELECT nama
FROM peserta */
const queryPesertaGuru = async () => [
  { nama: "Peserta 1" },
  { nama: "Peserta 2" },
  { nama: "Peserta 3" },
];
