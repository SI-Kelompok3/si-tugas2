export default async (req, res) => {
  const data = await query();
  res.json({ data });
};

// TODO: Fetch jumlah guru berdasarkan kelas
/* SELECT k.id, k.nama, COUNT(DISTINCT
m.guru_id) AS jumlah_guru
FROM mengikuti AS m
RIGHT JOIN kelas AS k
ON k.id = m.kelas_id
GROUP BY m.kelas_id */
const query = async () => [
  {
    id: 1,
    nama: 'Teknik Mikroprosesor',
    jumlah_guru: 3,
  },
  {
    id: 2,
    nama: 'Sistem Informasi',
    jumlah_guru: 4,
  },
  {
    id: 3,
    nama: 'Sistem Basis Data',
    jumlah_guru: 2,
  },
];
