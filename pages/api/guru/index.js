import md5 from 'md5';
import executeQuery from '../../../config/db';

export default async (req, res) => {
  if(req.method !== 'POST') return;

  const { username, nama, password } = req.body;
  const encryptedPassword = md5(password);
  const postResult = await executeQuery({
    query: 'INSERT INTO guru (username, nama, password) VALUES (?)',
    values: [[username, nama, encryptedPassword]],
  });
  if (postResult.error !== undefined) {
    return res.json({
      error: true,
      message: `${username} dah ada gan`,
    });
  }
  res.json({
    message: `Sukses membuat akun guru dengan username ${username}`,
  });
  break;
};

