import executeQuery from '../../../config/db';
const md5 = require('md5');

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      const guru = await executeQuery({
        query: 'SELECT * FROM guru'
      })
      res.json(guru)
      break;
    case "POST":
      const { username, nama, password } = req.body;
      //TODO: Insert ke tabel guru, passwordnya pake MD5()
      const encryptedPassword = md5(password)
      const postResult = await executeQuery({
        query: 'INSERT INTO guru (username, nama, password) VALUES (?)',
        values: [[username, nama, encryptedPassword]]
      });
      if(postResult.error !== undefined){
        return res.json({
          error:true,
          message: `${username} dah ada gan`
        })
      }
      res.json({
        message: `Sukses membuat akun guru dengan username ${username}`,
      });
      break;
  }
};

//TODO: Fetch dari tabel guru
/* SELECT id, username, nama
FROM guru */
// const getQuery = async () => [
//   {
//     id: 1,
//     username: "guru1",
//     nama: "Pak Alpha",
//   },
//   {
//     id: 2,
//     username: "guru2",
//     nama: "Bu Beta",
//   },
// ];
