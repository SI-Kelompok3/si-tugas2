import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { capitalizeFirstLetter } from '../../../lib/utility';
import Layout from '../../../components/Layout';
import withAuth from '../../../lib/withAuth';
import {
  getKelasDetailAdmin,
  getKelasDetailGuru,
  getKelasDetailPeserta,
} from '../../../lib/queries';
import fetchJson from '../../../lib/fetchJson';

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
    if (data.nama) return { props: { data, user, kelas_id } };
    return { notFound: true };
  });
}

const DetailKelas = ({ data, user, kelas_id }) => {
  const router = useRouter();
  const [message, setMessage] = useState('');

  const handleAmbilKelas = async () => {
    const ambil = await fetchJson(`/api/kelas/${kelas_id}`, {
      method: 'POST',
    });
    setMessage(ambil.message ?? '');
    if (!ambil.error) {
      router.reload();
    }
  };

  const handleDeleteKelas = async () => {
    await fetchJson(`/api/kelas/${kelas_id}`, {
      method: 'DELETE',
    });
    router.replace('/kelas');
  };

  return (
    <Layout>
      <div className="main deskripsi-kelas-page">
        <h1>{data.nama}</h1>
        <div className="deskripsi-kelas-details">
          <b>Deskripsi:</b>
          <p>{data.deskripsi ?? '-'}</p>
          <b>Waktu:</b>
          <p>
            {capitalizeFirstLetter(data.hari)}, {data.waktu}
          </p>
          <b>Durasi Kelas:</b>
          <p>{data.durasi}</p>
          <b>Kapasitas:</b>
          <p>{data.kapasitas} Peserta</p>
        </div>
        {user.role === 'admin' && (
          <>
            <b>Status Kelas: </b>
            <span>{capitalizeFirstLetter(data.status)}</span>
            <button onClick={handleDeleteKelas} className="hapus-kls-btn">
              Hapus kelas 🗑
            </button>
            <br />
            <b>Pengajar:</b>
            <div className="table-wrapper">
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
            </div>
            <Link href={`/kelas/${kelas_id}/edit`} passHref>
              <a>Ubah kelas</a>
            </Link>
          </>
        )}
        {user.role === 'guru' && data.peserta.length > 0 && (
          <>
            <b>5 Peserta terbaik (nilai tertinggi)</b>
            <div className="table-wrapper">
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
            </div>
          </>
        )}
        {(user.role === 'guru'
          || (user.role === 'peserta' && data.terambil && data.status !== 'terbuka')) && (
          <Link href={`/kelas/${kelas_id}/sesi`} passHref>
            <a className="lihat-link">Lihat sesi</a>
          </Link>
        )}
        {/* {(user.role === 'guru' || user.role === 'admin') && ( */}
        <Link href={`/kelas/${kelas_id}/peserta`} passHref>
          <a className="lihat-link">Lihat peserta</a>
        </Link>
        {/* )} */}
        {user.role === 'peserta'
          && (data.terambil ? (
            <div className="nilai">
              <p>Nilai:</p>
              <p>{data.nilai ?? '-'}</p>
            </div>
          ) : (
            data.status === 'terbuka' && (
              <button onClick={handleAmbilKelas} className="ambil-btn">
                Ambil kelas
              </button>
            )
          ))}
        {message !== '' && (
          <>
            <br />
            <b>{message}</b>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DetailKelas;
