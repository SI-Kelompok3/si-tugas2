export default async (req, res) => {
  const { materi, tanggal } = req.query;
  const data = await query(materi, tanggal);
  res.json({ data });
};

//TODO: Fetch detail sesi
/* SELECT p.nama, s.hadir,
s.keterangan
FROM sesi AS s
INNER JOIN mengikuti AS m
ON m.id = s.mengikuti_id
INNER JOIN peserta AS p
ON p.id = m.peserta_id
WHERE s.materi = ${materi} AND
s.tanggal = ${tanggal} */
const query = async (materi, tanggal) => [
  {
    nama: "Peserta 1",
    hadir: "1",
    keterangan: null,
  },
  {
    nama: "Peserta 2",
    hadir: "1",
    keterangan: null,
  },
  {
    nama: "Peserta 3",
    hadir: "0",
    keterangan: "Sakit",
  },
];
