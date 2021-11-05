import { transaction } from "../../../config/db";

export default async (req, res) => {
  if (req.method !== "POST") return;

  // TODO: Insert into table kelas & ke tabel mengikuti yang agak bingungin (assign guru)
  // 1. Insert ke tabel kelas
  // 2. Insert ke mengikuti dengan peserta_id yg null
  // 3. Peserta bakal ngambil & ketambah di mengikuti,
  //  di querynya cek apakah masih kurang dari kapasitas
  // 4. Admin perlu ngubah status jadi berjalan
  // 5. Delete entry yang peserta_id null
  const { nama, durasi, deskripsi, waktu, hari, kapasitas, status, guru } =
    req.body;

  let postResult = transaction()
    .query(`INSERT INTO kelas (nama, durasi, deskripsi, waktu, hari, kapasitas, status) VALUES (
        ${nama}, 
        ${durasi}, 
        ${deskripsi}, 
        ${waktu}, 
        ${hari}, 
        ${kapasitas}, 
        ${status}
      )`);
  // .query((r) => ['INSERT INTO mengikuti ()'],r.insertId);
  guru.forEach(
    (g) =>
      (postResult = postResult.query((r) => [
        `INSERT INTO mengikuti (guru_id, kelas_id) VALUES (${g.id}, ?)`,
        r.insertId,
      ]))
  );
  await postResult.commit();

  res.json({
    message: `Berhasil menambahkan kelas '${nama}'`,
  });
};
