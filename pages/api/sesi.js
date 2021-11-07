import { transaction } from '../../config/db';

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
          d.keterangan !== '' || d.keterangan !== null
            ? `keterangan = '${d.keterangan}'`
            : 'keterangan = NULL'
          }
            WHERE mengikuti_id = ${d.mengikuti_id}`,
        )),
      );
      await putResult.commit();
      res.json({ message: 'Perubahan data sesi berhasil' });
      break;
  }
};
