import executeQuery, { transaction } from '../../config/db';
import { sqlToObject } from '../../lib/utility';

export default async (req, res) => {
  switch (req.method) {
    case 'PUT':
      const { data } = req.body;
      let putResult = transaction();
      data.forEach(
        (d) => (putResult = putResult.query(
          `UPDATE sesi SET 
            hadir = ${d.hadir ? '1' : '0'},
            ${
          d.keterangan !== '' || d.keterangan !== null || d.keterangan !== 'null'
            ? `keterangan = '${d.keterangan}'`
            : 'keterangan = NULL'
          }
            WHERE mengikuti_id = ${d.mengikuti_id}`,
        )),
      );
      await putResult.commit();
      res.json({ message: 'Perubahan data sesi berhasil' });
      break;
    case 'POST':
      const {
        materi, deskripsi, tanggal, kelas_id, guru_id,
      } = req.body;

      const mengikutiIds = (
        await executeQuery({
          query: `SELECT id FROM mengikuti WHERE kelas_id=${kelas_id} AND guru_id=${guru_id}`,
        })
      ).map(sqlToObject);

      let postResult = transaction();
      mengikutiIds.forEach(
        ({ id }) => (postResult = postResult.query(`
        INSERT INTO sesi (materi, deskripsi, hadir, keterangan, tanggal, mengikuti_id)
        VALUES ('${materi}', '${deskripsi}', 0, NULL, '${tanggal}', ${id})
      `)),
      );

      await postResult.commit();
      res.json({
        message: 'Sukses menambah sesi',
      });

      break;
  }
};
