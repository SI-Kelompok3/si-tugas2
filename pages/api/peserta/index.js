import executeQuery from '../../../config/db';

const md5 = require('md5');

export default async (req, res) => {
  switch (req.method) {
    case 'GET':
      const { role } = req.headers;
      let data = [];
      switch (role) {
        case 'peserta':
          data = await executeQuery({
            query: 'SELECT id, nama from peserta',
          });
          break;
        case 'guru':
          data = await executeQuery({
            query: 'SELECT id, nama from peserta',
          });
          break;
        case 'admin':
          data = await executeQuery({
            query: 'SELECT id, username, nama from peserta',
          });
          break;
        default:
          break;
      }
      res.json({ data });
      break;
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

// // TODO: Fetch tabel peserta berdasarkan role
// /* SELECT id, username, nama
// FROM peserta */
// const queryAdmin = async () => [
//   { id: '1', nama: 'Peserta 1', username: 'pst1' },
//   { id: '2', nama: 'Peserta 2', username: 'pst2' },
//   { id: '3', nama: 'Peserta 3', username: 'pst3' },
// ];

/* SELECT nama
FROM peserta */
// const queryPesertaGuru = async () => [
//   { nama: 'Peserta 1' },
//   { nama: 'Peserta 2' },
//   { nama: 'Peserta 3' },
// ];
