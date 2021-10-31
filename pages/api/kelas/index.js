import { transaction } from '../../../config/db';

export default async (req, res) => {
  switch (req.method) {
    case 'GET':
      const { role, user_id } = req.headers;
      let data = [];
      switch (role) {
        case 'admin':
          data = await queryAdmin();
          break;
        case 'guru':
          data = await queryGuru(user_id);
          break;
        case 'peserta':
          data = await queryPeserta(user_id);
          break;
        default:
          break;
      }
      res.json({ data });
      break;
    case 'POST':
      // TODO: Insert into table kelas & ke tabel mengikuti yang agak bingungin (assign guru)
      const {
        nama, durasi, deskripsi, waktu, hari, kapasitas, status, guru,
      } = req.body;

      let postResult = transaction().query(`INSERT INTO kelas (nama, durasi, deskripsi, waktu, hari, kapasitas, status) VALUES (
        ${nama}, 
        ${durasi}, 
        ${deskripsi}, 
        ${waktu}, 
        ${hari}, 
        ${kapasitas}, 
        ${status}
      )`);
      // .query((r) => ['INSERT INTO mengikuti ()'],r.insertId);
      guru.forEach((g) => postResult = postResult.query((r) => [`INSERT INTO mengikuti (guru_id, kelas_id) VALUES (${g.id}, ?)`, r.insertId]));
      await postResult.commit();


      res.json({
        message: `Berhasil menambahkan kelas '${nama}'`,
      });
      break;
    default:
      break;
  }
};

// // TODO: Fetch kelas berdasarkan role
// /* SELECT *
// FROM kelas */
// const queryAdmin = async () => [
//   {
//     id: '1',
//     nama: 'Sistem Informasi',
//     durasi: '01:40:00',
//     deskripsi:
//       'Mata kuliah yang membahas cara pembuatan sistem informasi yang baik',
//     waktu: '07:00:00',
//     hari: 'kamis',
//     kapasitas: 40,
//     status: 'terbuka',
//   },
//   {
//     id: '2',
//     nama: 'Sistem Basis Data',
//     durasi: '01:40:00',
//     deskripsi: 'Dasar basis data, bahasan utamanya adalah SQL',
//     waktu: '12:30:00',
//     hari: 'rabu',
//     kapasitas: 50,
//     status: 'berjalan',
//   },
//   {
//     id: '3',
//     nama: 'Teknik Mikroprosesor',
//     durasi: '00:50:00',
//     deskripsi: 'Pengenalan MCU beserta pengalamatan',
//     waktu: '16:00:00',
//     hari: 'selasa',
//     kapasitas: 60,
//     status: 'selesai',
//   },
// ];

// /* SELECT k.id, k.nama, k.hari, k.waktu
// as waktu_mulai,
// ADDTIME(k.waktu, k.durasi) as
// waktu_akhir
// FROM kelas AS k
// INNER JOIN mengikuti AS m
// ON k.id = m.kelas_id
// WHERE m.guru_id = ${user_id}
// GROUP BY k.id */
// const queryGuru = async (user_id) => [
//   {
//     id: '1',
//     nama: 'Sistem Informasi',
//     hari: 'kamis',
//     waktu_mulai: '07:00:00',
//     waktu_akhir: '08:40:00',
//   },
//   {
//     id: '2',
//     nama: 'Sistem Basis Data',
//     hari: 'rabu',
//     waktu_mulai: '12:30:00',
//     waktu_akhir: '14:10:00',
//   },
//   {
//     nama: 'Teknik Mikroprosesor',
//     hari: 'selasa',
//     waktu_mulai: '16:00:00',
//     waktu_akhir: '16:50:00',
//   },
// ];

// /* SELECT id, nama,
// hari, waktu AS waktu_mulai,
// ADDTIME(waktu, durasi) AS
// waktu_akhir,
// IF(EXISTS(SELECT id FROM
// mengikuti WHERE peserta_id =
// ${user_id} AND kelas_id =
// kelas.id),'1', '0' ) AS
// terambil
// FROM kelas */
// const queryPeserta = async (user_id) => [
//   {
//     id: '1',
//     nama: 'Sistem Informasi',
//     hari: 'kamis',
//     waktu_mulai: '07:00:00',
//     waktu_akhir: '08:40:00',
//     terambil: '0',
//   },
//   {
//     id: '2',
//     nama: 'Sistem Basis Data',
//     hari: 'rabu',
//     waktu_mulai: '12:30:00',
//     waktu_akhir: '14:10:00',
//     terambil: '1',
//   },
//   {
//     id: '3',
//     nama: 'Teknik Mikroprosesor',
//     hari: 'selasa',
//     waktu_mulai: '16:00:00',
//     waktu_akhir: '16:50:00',
//     terambil: '1',
//   },
// ];
