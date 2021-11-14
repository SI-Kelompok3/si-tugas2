import executeQuery, { transaction } from '../../../config/db';

export default async (req, res) => {
  const { kelas_id } = req.query;
  switch (req.method) {
    // Peserta mengambil kelas
    case 'POST':
      const peserta_id = JSON.parse(req.cookies.user).id;
      // Steps:
      // 0. Cek kapasitas
      const { kapasitas } = (
        await executeQuery({
          query: `SELECT kapasitas FROM kelas WHERE id = ${kelas_id}`,
        })
      )[0];
      const jumlahPeserta = (
        (await executeQuery({
          query: `SELECT DISTINCT(peserta_id) FROM mengikuti
              WHERE kelas_id = ${kelas_id} AND peserta_id IS NOT NULL`,
        })) ?? []
      ).length;

      if (jumlahPeserta >= kapasitas) {
        return res.json({ error: true, message: 'Kapasitas tidak cukup!' });
      }

      // 1. cari siapa pengajarnya
      const guruIds = (
        await executeQuery({
          query: `SELECT guru_id FROM mengikuti 
          WHERE kelas_id = ${kelas_id}
          AND peserta_id IS NULL`,
        })
      ).map((m) => m.guru_id);

      // 2. tambahin ke mengikuti
      let createResult = transaction();
      guruIds.forEach(
        (guru_id) => (createResult = createResult.query(
          `INSERT INTO mengikuti (kelas_id, guru_id, peserta_id)
        VALUES (${kelas_id}, ${guru_id}, ${peserta_id})`,
        )),
      );
      await createResult.commit();
      res.json({
        message: 'Sukses mengambil kelas',
      });
      break;
    case 'PUT':
      try {
        const {
          id, nama, durasi, deskripsi, waktu, hari, status, guru,
        } = req.body;

        let updateResult = transaction().query(`UPDATE kelas SET
                  nama = '${nama}',
                  durasi = '${durasi}',
                  deskripsi = '${deskripsi}',
                  waktu = '${waktu}',
                  hari = '${hari}',
                  status = '${status}'
                  WHERE id = ${id}`);

        if (status === 'berjalan') {
          guru.forEach(
            (g) => (updateResult = updateResult.query(
              `DELETE FROM mengikuti WHERE kelas_id = ${id} AND guru_id = ${g.id} AND peserta_id IS NULL`,
            )),
          );
        }

        await updateResult.commit();

        res.json({
          message: `Berhasil mengubah kelas '${nama}'`,
        });
      } catch (e) {
        res.json({ error: true, message: e.message });
      }
      break;
    case 'DELETE':
      // TODO: Admin hapus kelas, hapus mengikuti juga
      const mengikutiIds = (
        await executeQuery({
          query: `SELECT id FROM mengikuti WHERE kelas_id = ${kelas_id}`,
        })
      ).map((m) => m.id);

      let deleteResult = transaction();

      mengikutiIds.forEach(
        (id) => (deleteResult = deleteResult.query(`DELETE FROM sesi WHERE mengikuti_id = ${id}`)),
      );
      deleteResult = deleteResult
        .query(`DELETE FROM mengikuti WHERE kelas_id = ${kelas_id}`)
        .query(`DELETE FROM kelas WHERE id = ${kelas_id}`);

      await deleteResult.commit();

      res.json({ message: `Kelas dengan ID '${kelas_id}' berhasil dihapus` });
      break;
    default:
      break;
  }
};
