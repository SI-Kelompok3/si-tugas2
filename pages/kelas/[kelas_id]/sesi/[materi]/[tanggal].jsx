import React from 'react';
import Layout from '../../../../../components/Layout';
import { getSesiDetail } from '../../../../../lib/queries';
import withAuth from '../../../../../lib/withAuth';

export async function getServerSideProps(context) {
  return withAuth(
    context,
    async () => {
      const { materi, tanggal } = context.params;
      const data = await getSesiDetail(materi, tanggal);
      return { props: { data } };
    },
    ['guru'],
  );
}

const DetailSesi = ({ data }) => (
  <Layout>
    <h1>Daftar Kehadiran Peserta</h1>
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Nama</th>
          <th>Hadir</th>
          <th>Keterangan</th>
        </tr>
      </thead>
      <tbody>
        {data.map((peserta, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{peserta.nama}</td>
            <td>{peserta.hadir === '0' ? 'Tidak Hadir' : 'Hadir'}</td>
            <td>{peserta.keterangan ?? '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Layout>
);

export default DetailSesi;
