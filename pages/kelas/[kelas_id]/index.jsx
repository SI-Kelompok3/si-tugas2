import React from 'react';
import Link from 'next/link';
import { capitalizeFirstLetter } from '../../../lib/utility';
import Layout from '../../../components/Layout';
import withAuth from '../../../lib/withAuth';
import {
  getKelasDetailAdmin,
  getKelasDetailGuru,
  getKelasDetailPeserta,
} from '../../../lib/queries';

export async function getServerSideProps(context) {
  return withAuth(context, async (user) => {
    const { kelas_id } = context.params;
    let data = null;
    switch (user.role) {
      case 'admin':
        data = await getKelasDetailAdmin(kelas_id);
        break;
      case 'guru':
        data = await getKelasDetailGuru(kelas_id);
        break;
      case 'peserta':
        data = await getKelasDetailPeserta(kelas_id, user.id);
        break;
    }
    return { props: { data, user, kelas_id } };
  });
}

const DetailKelas = ({ data, user, kelas_id }) => (
  <Layout>
    <h1>{data.nama}</h1>
    <b>Deskripsi</b>
    <p>{data.deskripsi ?? '-'}</p>
    <b>Waktu</b>
    <p>
      {capitalizeFirstLetter(data.hari)}, {data.waktu}
    </p>
    <b>Durasi Kelas</b>
    <p>{data.durasi}</p>
    <b>Kapasitas</b>
    <p>{data.kapasitas} Peserta</p>
    {user.role === 'admin' && (
      <>
        <b>Status</b>
        <p>{capitalizeFirstLetter(data.status)}</p>
        <b>Pengajar</b>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {data.guru.map((guru) => (
              <tr key={guru.id}>
                <td>{guru.id}</td>
                <td>{guru.nama}</td>
                <td>{guru.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link href={`/kelas/${kelas_id}/edit`}>Ubah kelas</Link>
      </>
    )}
    {user.role === 'guru' && (
      <>
        <b>5 Peserta terbaik (nilai tertinggi)</b>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama</th>
              <th>Nilai</th>
            </tr>
          </thead>
          <tbody>
            {data.peserta.map((peserta, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{peserta.nama}</td>
                <td>{peserta.nilai ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}
    {(user.role === 'guru' || user.role === 'peserta') && (
      <Link href={`/kelas/${kelas_id}/sesi`}>Lihat sesi</Link>
    )}
    {(user.role === 'guru' || user.role === 'admin') && (
      <Link href={`/kelas/${kelas_id}/peserta`}>Lihat peserta</Link>
    )}
    {user.role === 'peserta' && (data.terambil ? (
      <div>
        <b>Nilai</b>
        <p>{data.nilai ?? '-'}</p>
      </div>
    ) : (
      <button>Ambil kelas</button>
    ))}
  </Layout>
);

export default DetailKelas;
