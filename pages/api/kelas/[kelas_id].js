import executeQuery from "../../../config/db";
import { sqlToObject } from "../../../lib/utility";

export default async (req, res) => {
  const { kelas_id } = req.query;
  switch (req.method) {
    case "PUT":
      // TODO: Admin update kelas & tabel mengikuti yang agak bingungin (assign guru)
      const { nama, durasi, deskripsi, waktu, hari, kapasitas, status, guru } =
        req.body;
      const putResult = await executeQuery({
        query: "UPDATE ",
      });
      res.json({
        message: `Berhasil mengubah kelas '${nama}'`,
      });
      break;
    case "DELETE":
      // TODO: Admin hapus kelas
      res.json({ message: `Kelas dengan ID '${kelas_id}' berhasil dihapus` });
      break;
    default:
      break;
  }
};
