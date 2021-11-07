import executeQuery, { transaction } from '../../config/db';

export default async (req, res) => {
  switch (req.method) {
    case 'POST':
      const { username, nama, password } = req.body;

      const result = await executeQuery({
        query: `INSERT INTO peserta (username, nama, password) VALUES ('${username}', '${nama}', MD5('${password}'))`,
      });
      if (result.error !== undefined) {
        return res.json({
          error: true,
          message: `Peserta dengan username '${username}' sudah ada`,
        });
      }
      res.json({
        message: 'Pendaftaran akun peserta berhasil, silahkan login!',
      });
      break;
    case 'PUT':
      const { data } = req.body;
      let putResult = transaction();
      data.forEach(
        (d) => (putResult = putResult.query(
          `UPDATE mengikuti SET nilai = ${d.nilai ?? 0} WHERE id = ${d.id}`,
        )),
      );
      await putResult.commit();
      res.json({
        message: 'Sukses mengubah nilai peserta',
      });
  }
};
