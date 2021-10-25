export default async (req, res) => {
  const data = await query();
  res.json({ data });
};

//TODO: Fetch jumlah peserta berdasarkan kelas
/* SELECT k.id, k.nama, COUNT(DISTINCT
m.peserta_id) AS jumlah_peserta
FROM mengikuti AS m
RIGHT JOIN kelas AS k
ON k.id = m.kelas_id
GROUP BY m.kelas_id */
const query = async () => [
  {
    id: 1,
    nama: "Teknik Mikroprosesor",
    jumlah_peserta: 48,
  },
  {
    id: 2,
    nama: "Sistem Informasi",
    jumlah_peserta: 32,
  },
  {
    id: 3,
    nama: "Sistem Basis Data",
    jumlah_peserta: 50,
  },
];
