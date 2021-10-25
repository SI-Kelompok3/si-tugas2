export default async (req, res) => {
  const { peserta_id } = req.query;

  const data = await query(peserta_id);

  res.json({ data });
};

//TODO: Fetch
/* SELECT k.id, k.nama, k.hari, k.waktu
as waktu_mulai,
ADDTIME(k.waktu, k.durasi) as
waktu_akhir, COUNT(s.id) AS
jumlah_kehadiran, m.nilai
FROM kelas AS k
LEFT JOIN mengikuti AS m
ON m.kelas_id = k.id
LEFT JOIN sesi AS s
ON s.mengikuti_id = m.id AND
s.hadir = '1'
WHERE m.peserta_id = ${peserta_id}
  GROUP BY k.id */
const query = async (peserta_id) => [
  {
    id: "2",
    nama: "Sistem Basis Data",
    hari: "rabu",
    waktu_mulai: "12:30:00",
    waktu_akhir: "14:10:00",
    jumlah_kehadiran: 2,
    nilai: 80,
  },
  {
    id: "3",
    nama: "Teknik Mikroprosesor",
    hari: "selasa",
    waktu_mulai: "16:00:00",
    waktu_akhir: "16:50:00",
    jumlah_kehadiran: 3,
    nilai: 75,
  },
];
