export default async (req, res) => {
  const { id } = req.query;

  //TODO: Fetch detail peserta
  /* SELECT username, nama
    FROM peserta
    WHERE id = ${id} */
  const peserta = { username: `usernamepeserta${id}`, nama: "Peserta Nama" };

  //TODO: Fetch jumlah kehadiran peserta berdasarkan kelas
  /* SELECT k.nama, COUNT(s.id) AS
    jumlah_kehadiran
    FROM kelas AS k
    LEFT JOIN mengikuti AS m
    ON m.kelas_id = k.id
    LEFT JOIN sesi AS s
    ON s.mengikuti_id = m.id AND
    s.hadir = '1'
    WHERE m.peserta_id =
    ${id}
    GROUP BY k.id */
  const kehadiran = [
    {
      nama: "Sistem Informasi",
      jumlah_kehadiran: 6,
    },
    {
      nama: "Sistem Basis Data",
      jumlah_kehadiran: 5,
    },
    {
      nama: "Teknik Mikroprosesor",
      jumlah_kehadiran: 3,
    },
  ];

  res.json({
    peserta,
    kehadiran,
  });
};
