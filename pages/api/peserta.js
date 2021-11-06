import executeQuery from '../../config/db';

export default async (req, res) => {
  if (req.method !== 'POST') return;

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
};
