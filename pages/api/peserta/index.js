export default async (req, res) => {
  switch (req.method) {
    case "GET":
      const { role } = req.headers;
      let users = [];
      switch (role) {
        case "peserta":
          users = queryPesertaGuru();
          break;
        case "guru":
          users = queryPesertaGuru();
          break;
        case "admin":
          users = queryAdmin();
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
        message: "Berhasil mendaftarkan akun peserta",
      });
      break;
  }
};

//TODO : Fetch tabel peserta dari DB
/* SELECT nama
FROM peserta */
const queryPesertaGuru = () => [
  { nama: "Peserta 1" },
  { nama: "Peserta 2" },
  { nama: "Peserta 3" },
];

/* SELECT username, nama
FROM peserta */
const queryAdmin = () => [
  { nama: "Peserta 1", username: "pst1" },
  { nama: "Peserta 2", username: "pst2" },
  { nama: "Peserta 3", username: "pst3" },
];
