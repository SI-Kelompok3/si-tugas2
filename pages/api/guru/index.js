import executeQuery from '../../../config/db';

export default async (req, res) => {
  if (req.method !== 'POST') return;

  const { username, nama, password } = req.body;
  const postResult = await executeQuery({
    query: `INSERT INTO guru (username, nama, password) VALUES ('${username}', '${nama}', md5('${password}'))`,
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
};
