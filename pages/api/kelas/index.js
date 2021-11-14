import { transaction } from '../../../config/db';

export default async (req, res) => {
  if (req.method !== 'POST') return;

  try {
    // TODO: Insert into table kelas & ke tabel mengikuti yang agak bingungin (assign guru)
    // 1. Insert ke tabel kelas
    // 2. Insert ke mengikuti dengan peserta_id yg null
    // 3. Peserta bakal ngambil & ketambah di mengikuti,
    //  di querynya cek apakah masih kurang dari kapasitas
    // 4. Admin perlu ngubah status jadi berjalan
    // 5. Delete entry yang peserta_id null
    const {
      nama, durasi, deskripsi, waktu, hari, kapasitas, status, guru,
    } = req.body;

    let createResult = transaction()
      .query(`INSERT INTO kelas (nama, durasi, deskripsi, waktu, hari, kapasitas, status) VALUES (
        '${nama}', 
        '${durasi}', 
        '${deskripsi}', 
        '${waktu}', 
        '${hari}', 
        '${kapasitas}', 
        '${status}'
      )`);
    let kelasId = null;
    guru.forEach(
      (g) => (createResult = createResult.query((r) => {
        kelasId = kelasId === null ? r.insertId : kelasId;
        return [
          `INSERT INTO mengikuti (guru_id, kelas_id, peserta_id) VALUES (${g.id}, ?, NULL)`,
          kelasId,
        ];
      })),
    );
    const [kelasInsert] = await createResult.commit();

    res.json({
      message: `Berhasil menambahkan kelas '${nama}'`,
      id: kelasInsert.insertId,
    });
  } catch (e) {
    console.log(e);
    res.json({ error: true, message: e.message });
  }
};
