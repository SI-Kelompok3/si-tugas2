import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
// import withAuth from "../../components/withAuth";
// import useFetch from "../../lib/useFetch";
import { capitalizeFirstLetter } from '../../lib/utility';
import withAuth from '../../lib/withAuth';
import {
  getKelasAdmin,
  getKelasGuru,
  getKelasPeserta,
} from '../../lib/queries';

export async function getServerSideProps(context) {
  return withAuth(context, async (user) => {
    let kelas = [];
    switch (user.role) {
      case 'admin':
        kelas = await getKelasAdmin(user.id);
        break;
      case 'guru':
        kelas = await getKelasGuru(user.id);
        break;
      case 'peserta':
        kelas = await getKelasPeserta(user.id);
        break;
    }
    return {
      props: {
        user,
        kelas,
      },
    };
  });
}

const Kelas = ({ user, kelas }) => {
  // Header tabel
  const header = () => {
    switch (user.role) {
      case 'admin':
        return (
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Durasi</th>
            <th>Deskripsi</th>
            <th>Waktu</th>
            <th>Hari</th>
            <th>Kapasitas</th>
            <th>Status</th>
          </tr>
        );
      case 'guru':
        return (
          <tr>
            <th>No.</th>
            <th>Nama</th>
            <th>Hari</th>
            <th>Waktu Mulai</th>
            <th>Waktu Akhir</th>
          </tr>
        );
      case 'peserta':
        return (
          <tr>
            <th>No.</th>
            <th>Nama</th>
            <th>Hari</th>
            <th>Waktu Mulai</th>
            <th>Waktu Akhir</th>
            <th>Terambil</th>
          </tr>
        );
    }
  };

  // Baris tabel
  const row = (item, index) => {
    switch (user.role) {
      case 'admin':
        return (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>
              <Link href={`/kelas/${item.id}`}>{item.nama}</Link>
            </td>
            <td>{item.durasi}</td>
            <td>{item.deskripsi.substring(0, 20)}...</td>
            <td>{item.waktu}</td>
            <td>{capitalizeFirstLetter(item.hari)}</td>
            <td>{item.kapasitas}</td>
            <td>{capitalizeFirstLetter(item.status)}</td>
          </tr>
        );
      case 'guru':
        return (
          <tr key={item.id}>
            <td>{index + 1}</td>
            <td>
              <Link href={`/kelas/${item.id}`}>{item.nama}</Link>
            </td>
            <td>{capitalizeFirstLetter(item.hari)}</td>
            <td>{item.waktu_mulai}</td>
            <td>{item.waktu_akhir}</td>
          </tr>
        );
      case 'peserta':
        return (
          <tr key={item.id}>
            <td>{index + 1}</td>
            <td>
              <Link href={`/kelas/${item.id}`}>{item.nama}</Link>
            </td>
            <td>{capitalizeFirstLetter(item.hari)}</td>
            <td>{item.waktu_mulai}</td>
            <td>{item.waktu_akhir}</td>
            <td>{item.terambil === '0' ? 'Tidak Terambil' : 'Terambil'}</td>
          </tr>
        );
    }
  };

  return (
    <Layout>
      <div className="main kelas-page">
        <div className="kelas-option">
          {user.role === 'admin' && (
            <div className="filter-kelas">
              <h4>Filter:</h4>
              <ul className="list-filter-kelas">
                <li>
                  <Link href="/kelas/peserta" passHref>
                    <a>Jumlah peserta berdasarkan kelas</a>
                  </Link>
                </li>
                <li>
                  <Link href="/kelas/guru" passHref>
                    <a>Jumlah guru berdasarkan kelas</a>
                  </Link>
                </li>
                <li>
                  <Link href="/kelas/nilai" passHref>
                    <a>Nilai rata-rata tiap kelas</a>
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {user.role === 'admin' && (
            <div className="buat-kelas">
              <Link href="/kelas/create">
                <a>Buat kelas ➕</a>
              </Link>
            </div>
          )}
        </div>
        <h1>List kelas {user.role === 'guru' && 'yang diampu'}</h1>
        <div className="table-wrapper">
          <table>
            <thead>{header()}</thead>
            <tbody>{kelas.map(row)}</tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Kelas;
