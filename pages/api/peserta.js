import md5 from 'md5';
import executeQuery from '../../config/db';

export default async (req, res) => {
  switch (req.method) {
    case 'POST':
      const { username, nama, password } = req.body;
      // TODO: Insert ke tabel peserta di DB'
      const encryptedPassword = md5(password);
      const result = await executeQuery({
        query: 'INSERT INTO peserta (username, nama, password) VALUES (?)',
        values: [[username, nama, encryptedPassword]],
      });
      if (result.error !== undefined) {
        return res.json({
          error: true,
          message: `${username} dah ada gan`,
        });
      }
      res.json({
        message: 'Pendaftaran akun peserta berhasil, silahkan login!',
      });
      break;
  }
};
