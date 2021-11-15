import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import withAuth from '../../lib/withAuth';
import { getKelasWithPeserta } from '../../lib/queries';

export async function getServerSideProps(context) {
  return withAuth(
    context,
    async () => {
      const data = await getKelasWithPeserta();
      return { props: { data } };
    },
    ['admin'],
  );
}

const ListKelasPeserta = ({ data }) => (
  <Layout>
    <div className="main jumlah-peserta-page">
      <h1>List jumlah peserta berdasarkan kelas</h1>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama Kelas</th>
              <th>Jumlah Peserta</th>
            </tr>
          </thead>
          <tbody>
            {data.map((kelas, index) => (
              <tr key={kelas.id}>
                <td>{index + 1}</td>
                <td>
                  <Link href={`/kelas/${kelas.id}`}>{kelas.nama}</Link>
                </td>
                <td>{kelas.jumlah_peserta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </Layout>
);

export default ListKelasPeserta;
