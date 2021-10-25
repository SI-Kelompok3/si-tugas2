export default async (req, res) => {
  const { guru_id } = req.query;

  switch (req.method) {
    case "GET":
      const guru = await query(guru_id);
      res.json({ ...guru });
      break;
    case "DELETE":
      //TODO: Admin hapus akun guru
      res.json({
        message: `Akun guru dengan ID '${guru_id}' berhasil dihapus`,
      });
      break;
  }
};

//TODO: Fetch dari tabel guru
/* SELECT id, username, nama
FROM guru 
WHERE id = ${guru_id}*/
const query = async (guru_id) => ({
  id: guru_id,
  username: `guru${guru_id}`,
  nama: `Pak Guru Ke ${guru_id}`,
});
