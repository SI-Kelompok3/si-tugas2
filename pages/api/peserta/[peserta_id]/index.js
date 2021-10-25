export default async (req, res) => {
  if (req.method !== "GET") return;

  const { peserta_id } = req.query;

  const data = await query(peserta_id);

  res.json({ ...data });
};

//TODO: Fetch detail peserta
/* SELECT username, nama
    FROM peserta
    WHERE id = ${peserta_id} */

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
    ${peserta_id}
    GROUP BY k.id */
const query = async (peserta_id) => ({
  peserta: {
    username: `usernamepeserta${peserta_id}`,
    nama: "Peserta Nama",
  },
  kehadiran: [
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
  ],
});
