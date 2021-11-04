import moment from 'moment';
import executeQuery from '../config/db';
import { sqlToObject } from './utility';

export const getTopPeserta = async () => {
  const data = await executeQuery({
    query: `SELECT k.id, k.nama, COUNT(DISTINCT m.peserta_id)
            AS jumlah_peserta
            FROM mengikuti AS m
            RIGHT JOIN kelas AS k
            ON k.id = m.kelas_id
            GROUP BY m.kelas_id
            ORDER BY jumlah_peserta DESC
            LIMIT 5`,
  });
  return data.map(sqlToObject);
};

export const getTopGuru = async () => {
  const data = await executeQuery({
    query: `SELECT k.id, k.nama, COUNT(DISTINCT
      m.guru_id) AS jumlah_guru
      FROM mengikuti AS m
      RIGHT JOIN kelas AS k
      ON k.id = m.kelas_id
      GROUP BY m.kelas_id
      ORDER BY jumlah_guru ASC
      LIMIT 5`,
  });
  return data.map(sqlToObject);
};

export const getKelasForPeserta = async (peserta_id) => {
  const data = await executeQuery({
    query: `SELECT k.id, k.nama, k.hari, k.waktu
    as waktu_mulai,
    ADDTIME(k.waktu, k.durasi) as
    waktu_akhir, COUNT(s.id) AS
    jumlah_kehadiran, m.nilai
    FROM kelas AS k
    LEFT JOIN mengikuti AS m
    ON m.kelas_id = k.id
    LEFT JOIN sesi AS s
    ON s.mengikuti_id = m.id AND
    s.hadir = '1'
    WHERE m.peserta_id = ${peserta_id}`,
  });
  return data.map(sqlToObject);
};

export const getGuruById = async (guru_id) => {
  const [guru] = await executeQuery({
    query: 'SELECT id, username, nama FROM guru WHERE id = ?',
    values: [guru_id],
  });
  return { ...sqlToObject(guru) };
};

export const getGuru = async () => {
  const guru = await executeQuery({
    query: 'SELECT id, username, nama FROM guru',
  });
  return guru.map(sqlToObject);
};

export const getKelasAdmin = async () => {
  const data = await executeQuery({
    query: 'SELECT * FROM kelas',
  });
  return data.map(sqlToObject);
};

export const getKelasGuru = async (guru_id) => {
  const data = await executeQuery({
    query: `SELECT k.id, k.nama, k.hari, k.waktu
    as waktu_mulai,
    ADDTIME(k.waktu, k.durasi) as
    waktu_akhir
    FROM kelas AS k
    INNER JOIN mengikuti AS m
    ON k.id = m.kelas_id
    WHERE m.guru_id = ${guru_id}
    GROUP BY k.id`,
  });
  return data.map(sqlToObject);
};

export const getKelasPeserta = async (peserta_id) => {
  const data = await executeQuery({
    query: `SELECT id, nama,
    hari, waktu AS waktu_mulai,
    ADDTIME(waktu, durasi) AS
    waktu_akhir,
    IF(EXISTS(SELECT id FROM
    mengikuti WHERE peserta_id = ${peserta_id} 
    AND kelas_id = kelas.id),'1', '0' ) AS
    terambil
    FROM kelas`,
  });
  return data.map(sqlToObject);
};

export const getKelasWithGuru = async () => {
  const data = await executeQuery({
    query: `SELECT k.id, k.nama, COUNT(DISTINCT
      m.guru_id) AS jumlah_guru
      FROM mengikuti AS m
      RIGHT JOIN kelas AS k
      ON k.id = m.kelas_id
      GROUP BY m.kelas_id`,
  });
  return data.map(sqlToObject);
};

export const getAverageNilai = async () => {
  const data = await executeQuery({
    query: `SELECT k.id, k.nama, AVG(m.nilai) AS nilai
    FROM kelas AS k
    INNER JOIN mengikuti AS m
    ON m.kelas_id = k.id
    GROUP BY k.id`,
  });
  return data.map(sqlToObject);
};

export const getKelasWithPeserta = async () => {
  const data = await executeQuery({
    query: `SELECT k.id, k.nama, COUNT(DISTINCT
      m.peserta_id) AS jumlah_peserta
      FROM mengikuti AS m
      RIGHT JOIN kelas AS k
      ON k.id = m.kelas_id
      GROUP BY m.kelas_id`,
  });
  return data.map(sqlToObject);
};

export const getKelasDetailAdmin = async (kelas_id) => {
  const fetchedKelas = await executeQuery({
    query: 'SELECT * FROM kelas WHERE id = (?)',
    values: [kelas_id],
  });
  const fetchedGuru = await executeQuery({
    query: `SELECT g.id, g.nama, g.username
            FROM guru AS g
            INNER JOIN mengikuti AS m
            ON m.guru_id = g.id
            WHERE m.kelas_id = (?)
            GROUP BY g.id`,
    values: [kelas_id],
  });
  const convertedGuru = fetchedGuru.map(sqlToObject);
  return {
    ...fetchedKelas[0],
    guru: convertedGuru,
  };
};

export const getKelasDetailGuru = async (kelas_id) => {
  const fetchedKelas = await executeQuery({
    query: `SELECT nama, durasi, deskripsi,
              waktu, hari, kapasitas
              FROM kelas
              WHERE id = (?)`,
    values: [kelas_id],
  });
  const fetchedPeserta = await executeQuery({
    query: `SELECT p.nama, AVG(m.nilai) AS
            nilai
            FROM peserta AS p
            INNER JOIN mengikuti AS m
            ON m.peserta_id = p.id
            WHERE m.kelas_id = (?)
            GROUP BY p.id
            ORDER BY m.nilai DESC
            LIMIT 5`,
    values: [kelas_id],
  });
  const convertedPeserta = fetchedPeserta.map(sqlToObject);
  return {
    ...fetchedKelas[0],
    peserta: convertedPeserta,
  };
};

// TODO: Fix problem kalau peserta ngeget yg ngga dijoin (returnnya bakal null)
export const getKelasDetailPeserta = async (kelas_id, peserta_id) => {
  /*
    1. cek di mengikuti peserta_id & kelas_id ada ngga?
    2. kalau ada return fetchedKelas biasa
    3. kalau ngga ada return detail kelasnya
  */
  const fetchedKelas = await executeQuery({
    query: `SELECT k.nama, k.durasi, k.deskripsi,
            k.waktu, k.hari, k.kapasitas,
            AVG(m.nilai) as nilai
            FROM kelas as k
            INNER JOIN mengikuti AS m
            ON m.kelas_id = k.id
            WHERE k.id = ${kelas_id} AND
            m.peserta_id = ${peserta_id}
            GROUP BY k.id`,
  });
  if (!fetchedKelas.length) {
    const data = await executeQuery({
      query: `SELECT nama, durasi, deskripsi,
              waktu, hari, kapasitas
              FROM kelas WHERE id = ${kelas_id}`,
    });
    return data.map(sqlToObject);
  }
  return {
    ...fetchedKelas[0],
    terambil: true,
  };
};

export const getPesertaForKelasAdminGuru = async (kelas_id) => {
  const data = await executeQuery({
    query: `SELECT p.nama, COUNT(s.id) AS
    jumlah_kehadiran, AVG(m.nilai)
    AS nilai
    FROM peserta AS p
    LEFT JOIN mengikuti AS m
    ON m.peserta_id = p.id
    LEFT JOIN sesi AS s
    ON s.mengikuti_id = m.id AND
    s.hadir = '1'
    WHERE m.kelas_id = ${kelas_id}
    GROUP BY p.id`,
  });
  return data.map(sqlToObject);
};

export const getPesertaForKelasPeserta = async (kelas_id) => {
  const data = await executeQuery({
    query: `SELECT p.nama
    FROM peserta as p
    INNER JOIN mengikuti as m
    ON p.id = m.peserta_id
    WHERE m.kelas_id = ${kelas_id}
    GROUP BY p.id`,
  });
  return data.map(sqlToObject);
};

export const getSesiGuru = async (kelas_id) => {
  const data = await executeQuery({
    query: `SELECT s.id, s.materi, s.tanggal,
    g.nama AS pengajar, COUNT(s.id)
    AS jumlah_kehadiran
    FROM sesi AS s
    LEFT JOIN mengikuti AS m
    ON s.mengikuti_id = m.id AND
    s.hadir = '1'
    LEFT JOIN guru AS g
    ON m.guru_id = g.id
    WHERE m.kelas_id = ${kelas_id}
    GROUP BY s.materi
    ORDER BY s.tanggal`,
  });
  return data.map(sqlToObject);
};

export const getSesiPeserta = async (kelas_id, peserta_id) => {
  const data = await executeQuery({
    query: `SELECT s.id, s.materi, s.tanggal, g.nama AS pengajar,
    s.hadir
    FROM sesi AS s
    LEFT JOIN mengikuti AS m
    ON s.mengikuti_id = m.id
    LEFT JOIN guru AS g
    ON m.guru_id = g.id
    WHERE m.kelas_id = ${kelas_id}
    AND m.peserta_id = ${peserta_id}
    ORDER BY s.tanggal`,
  });
  return data.map(sqlToObject);
};

export const getSesiDetail = async (materi, tanggal) => {
  const date = moment(tanggal).format('yyyy-MM-DD');
  const query = `SELECT p.nama, s.hadir,
    s.keterangan
    FROM sesi AS s
    INNER JOIN mengikuti AS m
    ON m.id = s.mengikuti_id
    INNER JOIN peserta AS p
    ON p.id = m.peserta_id
    WHERE s.materi = "${materi}" AND
    s.tanggal = "${date}"`;
  const data = await executeQuery({
    query,
  });
  return data.map(sqlToObject);
};

export const getPesertaPesertaGuru = async () => {
  const data = await executeQuery({
    query: 'SELECT id, nama from peserta',
  });
  return data.map(sqlToObject);
};

export const getPesertaAdmin = async () => {
  const data = await executeQuery({
    query: 'SELECT id, username, nama from peserta',
  });
  return data.map(sqlToObject);
};

export const getPesertaDetail = async (peserta_id) => {
  const dataPeserta = await executeQuery({
    query: `SELECT username, nama
    FROM peserta
    WHERE id = ${peserta_id}`,
  });
  const dataKehadiran = await executeQuery({
    query: `SELECT k.nama, COUNT(s.id) AS
    jumlah_kehadiran
    FROM kelas AS k
    LEFT JOIN mengikuti AS m
    ON m.kelas_id = k.id
    LEFT JOIN sesi AS s
    ON s.mengikuti_id = m.id AND
    s.hadir = '1'
    WHERE m.peserta_id =
    ${peserta_id}
    GROUP BY k.id`,
  });
  const convertedDataKehadiran = dataKehadiran.map(sqlToObject);
  const result = {
    peserta: { ...dataPeserta[0] },
    kehadiran: convertedDataKehadiran,
  };
  return result;
};