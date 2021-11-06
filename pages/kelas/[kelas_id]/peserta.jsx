import React from 'react';
import Layout from '../../../components/Layout';
import withAuth from '../../../lib/withAuth';
import {
  getPesertaForKelasAdminGuru,
  getPesertaForKelasPeserta,
} from '../../../lib/queries';

export async function getServerSideProps(context) {
  return withAuth(context, async (user) => {
    const { kelas_id } = context.params;
    let data = null;
    if (user.role === 'admin' || user.role === 'guru') {
      data = await getPesertaForKelasAdminGuru(kelas_id);
    } else {
      data = await getPesertaForKelasPeserta(kelas_id);
    }
    return { props: { data } };
  });
}

const PesertaKelas = ({ data }) => (
  <Layout>
    <h1>Daftar Peserta</h1>
    {data.length > 0 ? (
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama</th>
            <th>Jumlah Kehadiran</th>
            <th>Nilai</th>
          </tr>
        </thead>
        <tbody>
          {data.map((peserta, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{peserta.nama}</td>
              <td>{peserta.jumlah_kehadiran}</td>
              <td>{peserta.nilai ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>Belum ada peserta yang mendaftar</p>
    )}
  </Layout>
);

export default PesertaKelas;
