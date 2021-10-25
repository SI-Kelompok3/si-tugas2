export default async (req, res) => {
  const { role } = req.headers;
  const { kelas_id } = req.query;

  let data = [];
  switch (role) {
    case "guru":
      const { materi, tanggal } = req.headers;
      data = await queryGuru(kelas_id);
      break;
    case "peserta":
      const { user_id } = req.headers;
      data = await queryPeserta(kelas_id, user_id);
      break;
  }
  res.json({ data });
};

//TODO: Fetch sesi berdasarkan role

/* SELECT s.id, s.materi, s.tanggal,
g.nama AS pengajar, COUNT(s.id)
AS jumlah_kehadiran
FROM sesi AS s
LEFT JOIN mengikuti AS m
ON s.mengikuti_id = m.id AND
s.hadir = '1'
LEFT JOIN guru AS g
ON m.guru_id = g.id
WHERE m.kelas_id = ${kelas_id}
GROUP BY s.materi
ORDER BY s.tanggal */
const queryGuru = async (kelas_id) => [
  {
    id: "1",
    materi: "Aljabar I",
    tanggal: "2021-10-20",
    pengajar: "Pak Alpha",
    jumlah_kehadiran: 3,
  },
  {
    id: "2",
    materi: "Trigonometri",
    tanggal: "2021-10-27",
    pengajar: "Bu Beta",
    jumlah_kehadiran: 2,
  },
];

/* SELECT s.id, s.materi, s.tanggal, g.nama AS pengajar,
s.hadir
FROM sesi AS s
LEFT JOIN mengikuti AS m
ON s.mengikuti_id = m.id
LEFT JOIN guru AS g
ON m.guru_id = g.id
WHERE m.kelas_id = ${kelas_id}
AND m.peserta_id = ${user_id} 
ORDER BY s.tanggal
*/
const queryPeserta = async (kelas_id, user_id) => [
  {
    id: "1",
    materi: "Aljabar I",
    tanggal: "2021-10-20",
    pengajar: "Pak Alpha",
    hadir: "1",
  },
  {
    id: "2",
    materi: "Trigonometri",
    tanggal: "2021-10-27",
    pengajar: "Bu Beta",
    hadir: "0",
  },
];
