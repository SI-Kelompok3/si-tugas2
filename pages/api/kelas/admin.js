export default async (req, res) => {
  const [peserta, guru] = await Promise.all([
    queryTopPeserta(),
    queryTopGuru(),
  ]);
  res.json({ peserta, guru });
};

//TODO: Tabel top 5 kelas dengan peserta terbanyak
/* SELECT k.id, k.nama, COUNT(DISTINCT
m.peserta_id) AS jumlah_peserta
FROM mengikuti AS m
RIGHT JOIN kelas AS k
ON k.id = m.kelas_id
GROUP BY m.kelas_id
ORDER BY jumlah_peserta DESC
LIMIT 5 */
const queryTopPeserta = async () => [
  {
    id: 1,
    nama: "Teknik Mikroprosesor",
    jumlah_peserta: 100,
  },
  {
    id: 2,
    nama: "Sistem Informasi",
    jumlah_peserta: 90,
  },
  {
    id: 3,
    nama: "Sistem Basis Data",
    jumlah_peserta: 80,
  },
];

//TODO: Tabel top 5 kelas dengan jumlah guru terendah
/* SELECT k.id, k.nama, COUNT(DISTINCT
m.guru_id) AS jumlah_guru
FROM mengikuti AS m
RIGHT JOIN kelas AS k
ON k.id = m.kelas_id
GROUP BY m.kelas_id
ORDER BY jumlah_guru ASC
LIMIT 5 */
const queryTopGuru = async () => [
  {
    id: 1,
    nama: "Teknik Mikroprosesor",
    jumlah_guru: 0,
  },
  {
    id: 2,
    nama: "Sistem Informasi",
    jumlah_guru: 1,
  },
  {
    id: 3,
    nama: "Sistem Basis Data",
    jumlah_guru: 2,
  },
];
