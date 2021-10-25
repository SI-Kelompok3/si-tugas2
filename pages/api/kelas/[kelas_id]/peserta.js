export default async (req, res) => {
  const { kelas_id } = req.query;
  const { role } = req.headers;
  let data = [];

  data = await (role === "peserta"
    ? queryPeserta(kelas_id)
    : queryAdminGuru(kelas_id));
  res.json({ data });
};

//TODO: Fetch peserta yang ikut ke kelas tertentu berdasarkan role

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
const queryAdminGuru = async (kelas_id) => [
  { nama: "Peserta 1", jumlah_kehadiran: 3, nilai: 90 },
  { nama: "Peserta 2", jumlah_kehadiran: 3, nilai: 85 },
  { nama: "Peserta 3", jumlah_kehadiran: 2, nilai: 78 },
];

/* SELECT p.nama
FROM peserta as p
INNER JOIN mengikuti as m
ON p.id = m.peserta_id
WHERE m.kelas_id = 1
GROUP BY p.id */
const queryPeserta = async (kelas_id) => [
  { nama: "Peserta 1" },
  { nama: "Peserta 2" },
  { nama: "Peserta 3" },
];
