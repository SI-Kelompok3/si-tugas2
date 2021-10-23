export default async (req, res) => {
  const { kelas_id } = req.query;
  const peserta = await query(kelas_id);
  res.json({ data: peserta });
};

//TODO : Fetch peserta yang ikut ke kelas tertentu
/* SELECT p.nama, COUNT(s.id) AS
jumlah_kehadiran, AVG(m.nilai)
AS nilai
FROM peserta AS p
LEFT JOIN mengikuti AS m
ON m.peserta_id = p.id
LEFT JOIN sesi AS s
ON s.mengikuti_id = m.id AND
s.hadir = '1'
WHERE m.kelas_id = ${kelas_id}
GROUP BY p.id */
const query = async (kelas_id) => [
  { nama: "Peserta 1", jumlah_kehadiran: 3, nilai: 90 },
  { nama: "Peserta 2", jumlah_kehadiran: 3, nilai: 85 },
  { nama: "Peserta 3", jumlah_kehadiran: 2, nilai: 78 },
];
