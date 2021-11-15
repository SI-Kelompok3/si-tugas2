import executeQuery from '../../../config/db';

export default async (req, res) => {
  if (req.method !== 'DELETE') return;

  const { guru_id } = req.query;

  const deleteResult = await executeQuery({
    query: 'DELETE FROM guru WHERE id = ?',
    values: [guru_id],
  });
  if (deleteResult.error !== undefined) {
    return res.json({
      error: true,
      message: `Gagal menghapus guru dengan id ${guru_id} karena akun ini menjadi pengajar`,
    });
  }
  res.json({
    message: `Akun guru dengan ID '${guru_id}' berhasil dihapus`,
  });
};
