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

const PesertaKelas = ({ data }) => {
  return (
    <Layout>
      <h1>Daftar Peserta</h1>
      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Jumlah Kehadiran</th>
            <th>Nilai</th>
          </tr>
        </thead>
        <tbody>
          {data.map((peserta, index) => (
            <tr key={index}>
              <td>{peserta.nama}</td>
              <td>{peserta.jumlah_kehadiran}</td>
              <td>{peserta.nilai}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default PesertaKelas;
