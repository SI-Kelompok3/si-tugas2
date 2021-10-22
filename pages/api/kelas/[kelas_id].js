export default async (req, res) => {
  const { kelas_id } = req.query;
  switch (req.method) {
    case "PUT":
      //TODO: Admin ngubah kelas / assign guru ke kelas (?)
      break;
    case "DELETE":
      //TODO: Admin hapus kelas
      break;
    default:
      break;
  }
};
