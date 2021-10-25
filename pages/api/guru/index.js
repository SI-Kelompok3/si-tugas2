export default async (req, res) => {
  switch (req.method) {
    case "GET":
      const data = await getQuery();
      res.json({ data });
      break;
    case "POST":
      const { username, nama, password } = req.body;
      //TODO: Insert ke tabel guru, passwordnya pake MD5()
      res.json({
        message: `Sukses membuat akun guru dengan username ${username}`,
      });
      break;
  }
};

//TODO: Fetch dari tabel guru
/* SELECT id, username, nama
FROM guru */
const getQuery = async () => [
  {
    id: 1,
    username: "guru1",
    nama: "Pak Alpha",
  },
  {
    id: 2,
    username: "guru2",
    nama: "Bu Beta",
  },
];
