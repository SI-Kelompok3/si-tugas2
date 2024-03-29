import moment from 'moment';
import executeQuery from '../config/db';
import { sqlToObject } from './utility';

/// //////////////////////////////////////////////// ///
///                       Home                       ///
/// //////////////////////////////////////////////// ///

/// Melihat 5 kelas yang paling diminati (admin)
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

/// Melihat 5 kelas dengan guru paling sedikit (admin)
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

/// Menampilkan daftar kelas yang diambil dengan jumlah kehadiran dan nilai (peserta)
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
    WHERE m.peserta_id = ${peserta_id}
    GROUP BY k.id`,
  });
  return data.map(sqlToObject);
};

/// //////////////////////////////////////////////// ///
///                       Guru                       ///
/// //////////////////////////////////////////////// ///

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

/// //////////////////////////////////////////////// ///
///                       Kelas                      ///
/// //////////////////////////////////////////////// ///

/// Menampilkan daftar kelas (admin)
export const getKelasAdmin = async () => {
  const data = await executeQuery({
    query: 'SELECT * FROM kelas',
  });
  return data.map(sqlToObject);
};

/// Menampilkan kelas yang diampu (guru)
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

/// Menampilkan daftar kelas dan kondisi terambil atau tidak (peserta)
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

export const getKelasStatus = async (kelas_id) => {
  const [data] = await executeQuery({
    query: `SELECT status FROM kelas WHERE id=${kelas_id}`,
  });
  return sqlToObject(data).status;
};

/// Melihat jumlah peserta berdasarkan kelas (admin)
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

/// Melihat jumlah guru berdasarkan kelas (admin)
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

/// Melihat nilai rata-rata berdasarkan kelas
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

/// Melihat detail kelas (admin)
/// Melihat pengajar kelas (admin) [tambahan]
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

/// Melihat detail kelas (guru)
/// Melihat 5 peserta dengan nilai tertinggi pada kelas tertentu (guru)
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

/// Melihat detail kelas dengan nilai peserta (peserta)
export const getKelasDetailPeserta = async (kelas_id, peserta_id) => {
  const fetchedKelas = await executeQuery({
    query: `SELECT k.nama, k.durasi, k.deskripsi,
            k.waktu, k.hari, k.kapasitas, k.status,
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
      waktu, hari, kapasitas, status
      FROM kelas WHERE id = ${kelas_id}`,
    });
    return { ...data[0] };
  }
  return {
    ...fetchedKelas[0],
    terambil: true,
  };
};
/// //////////////////////////////////////////////// ///
///                   Kelas Peserta                  ///
/// //////////////////////////////////////////////// ///

/// Melihat daftar peserta pada kelas tertentu (admin) [ditambah kehadiran & nilainya]
/// Melihat daftar peserta pada kelas tertentu dengan jumlah kehadiran dan nilainya (guru)
export const getPesertaForKelasAdminGuru = async (kelas_id) => {
  const data = await executeQuery({
    query: `SELECT m.id, p.nama, COUNT(s.id) AS
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

/// Melihat daftar peserta pada kelas tertentu (peserta)
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

/// //////////////////////////////////////////////// ///
///                       Sesi                       ///
/// //////////////////////////////////////////////// ///

/// Melihat daftar sesi kelas tertentu dengan guru pengampu dan jumlah kehadiran (guru)
export const getSesiGuru = async (kelas_id) => {
  const data = await executeQuery({
    query: `SELECT s.id, s.materi, s.tanggal,
    g.nama AS pengajar, COUNT(CASE WHEN s.hadir = '1' THEN 1 END)
    AS jumlah_kehadiran
    FROM sesi AS s
    LEFT JOIN mengikuti AS m
    ON s.mengikuti_id = m.id
    LEFT JOIN guru AS g
    ON m.guru_id = g.id
    WHERE m.kelas_id = ${kelas_id}
    GROUP BY s.materi
    ORDER BY s.tanggal`,
  });

  return data.map(sqlToObject);
};

/// Melihat daftar sesi kelas tertentu dengan status hadir atau tidak (peserta)
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

/// Melihat daftar kehadiran peserta pada sesi tertentu (guru)
export const getSesiDetail = async (materi, tanggal, kelas_id) => {
  const date = moment(tanggal).format('yyyy-MM-DD');
  const query = `SELECT p.nama, s.hadir,
    s.keterangan, s.mengikuti_id
    FROM sesi AS s
    INNER JOIN mengikuti AS m
    ON m.id = s.mengikuti_id
    INNER JOIN peserta AS p
    ON p.id = m.peserta_id
    WHERE s.materi = "${materi}" AND
    s.tanggal = "${date}" AND m.kelas_id = ${kelas_id}`;
  const data = await executeQuery({
    query,
  });
  return data.map(sqlToObject);
};

/// //////////////////////////////////////////////// ///
///                       Peserta                    ///
/// //////////////////////////////////////////////// ///

/// Menampilkan daftar peserta (admin)
export const getPesertaAdmin = async () => {
  const data = await executeQuery({
    query: 'SELECT id, username, nama from peserta',
  });
  return data.map(sqlToObject);
};

/// Menampilkan daftar peserta (guru)
/// Menampilkan daftar peserta (peserta)
export const getPesertaPesertaGuru = async () => {
  const data = await executeQuery({
    query: 'SELECT id, nama from peserta',
  });
  return data.map(sqlToObject);
};

/// Melihat detail peserta (admin)
/// Melihat jumlah kehadiran seorang peserta berdasarkan kelas (admin)
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
