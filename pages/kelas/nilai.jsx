import React from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import withAuth from '../../lib/withAuth';
import { getAverageNilai } from '../../lib/queries';

export async function getServerSideProps(context) {
  return withAuth(
    context,
    async () => {
      const data = await getAverageNilai();
      return { props: { data } };
    },
    ['admin']
  );
}

const ListKelasNilai = ({ data }) => {
  return (
    <Layout>
      <h1>List nilai rata-rata tiap kelas</h1>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama Kelas</th>
            <th>Nilai Rerata</th>
          </tr>
        </thead>
        <tbody>
          {data.map((kelas, index) => (
            <tr key={kelas.id}>
              <td>{index + 1}</td>
              <td>
                <Link href={`/kelas/${kelas.id}`}>{kelas.nama}</Link>
              </td>
              <td>{kelas.nilai}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default ListKelasNilai;
