import React from 'react';
import Layout from '../../components/Layout';
import { getPesertaDetail } from '../../lib/queries';
import withAuth from '../../lib/withAuth';

export async function getServerSideProps(context) {
  return withAuth(
    context,
    async () => {
      const data = await getPesertaDetail(context.params.peserta_id);
      if (data.peserta.username) return { props: { data } };
      return {
        notFound: true,
      };
    },
    ['admin'],
  );
}

const DetailPeserta = ({ data }) => (
  <Layout>
    <div className="main peserta-id-page">
      <div className="details-wrapper">
        <h3>{data.peserta.nama}</h3>
        <p>Username : {data.peserta.username}</p>
      </div>
      <b>List kehadiran</b>
      <div className="table-wrapper">
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
      </div>
    </div>
  </Layout>
);

export default DetailPeserta;
