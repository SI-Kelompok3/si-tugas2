export default async (req, res) => {
  const guru = await query();
  res.json({ data: guru });
};

//TODO : Fetch dari tabel guru
/* SELECT id, nama
FROM guru */
const query = async () => [
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
