import React from 'react';
import Layout from '../../components/Layout';
import { getPesertaDetail } from '../../lib/queries';
import withAuth from '../../lib/withAuth';

export async function getServerSideProps(context) {
  return withAuth(
    context,
    async () => {
      const data = await getPesertaDetail(context.params.peserta_id);
      return { props: { data } };
    },
    ['admin']
  );
}

const DetailPeserta = ({ data }) => {
  return (
    <Layout>
      <h3>{data.peserta.nama}</h3>
      <p>Username : {data.peserta.username}</p>
      <b>List kehadiran</b>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama</th>
            <th>Jumlah kehadiran</th>
          </tr>
        </thead>
        <tbody>
          {data.kehadiran.map((kh, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{kh.nama}</td>
              <td>{kh.jumlah_kehadiran}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default DetailPeserta;
