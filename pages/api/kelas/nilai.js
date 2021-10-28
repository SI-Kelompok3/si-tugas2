export default async (req, res) => {
  const data = await query();
  res.json({ data });
};

// TODO: Fetch nilai rata-rata berdasarkan kelas
/* SELECT k.id, k.nama, AVG(m.nilai) AS nilai
FROM kelas AS k
INNER JOIN mengikuti AS m
ON m.kelas_id = k.id
GROUP BY k.id */
const query = async () => [
  {
    id: 1,
    nama: 'Teknik Mikroprosesor',
    nilai: 88,
  },
  {
    id: 2,
    nama: 'Sistem Informasi',
    nilai: 72,
  },
  {
    id: 3,
    nama: 'Sistem Basis Data',
    nilai: 90,
  },
];
