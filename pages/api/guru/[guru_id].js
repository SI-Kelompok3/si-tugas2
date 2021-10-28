import executeQuery from '../../../config/db';

export default async (req, res) => {
  const { guru_id } = req.query;

  switch (req.method) {
    case 'GET':
      const guru = await executeQuery({
        query: 'SELECT id, username, nama FROM guru WHERE id = ?',
        values: [guru_id],
      });
      res.json(...guru);
      break;
    case 'DELETE':
      // TODO: Admin hapus akun guru
      const deleteResult = await executeQuery({
        query: 'DELETE FROM guru WHERE id = ?',
        values: [guru_id],
      });
      if (deleteResult.error !== undefined) {
        return res.json({
          error: true,
          message: `Gagal menghapus guru dengan id ${guru_id}`,
        });
      }
      res.json({
        message: `Akun guru dengan ID '${guru_id}' berhasil dihapus`,
      });
      break;
  }
};
