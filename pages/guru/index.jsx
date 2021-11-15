import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import withAuth from '../../lib/withAuth';
import { getGuru } from '../../lib/queries';

export async function getServerSideProps(context) {
  return withAuth(
    context,
    async () => {
      const data = await getGuru();
      return {
        props: { data },
      };
    },
    ['admin'],
  );
}

const ListGuru = ({ data }) => (
  <Layout>
    <div className="main guru-page">
      <h1>List Guru</h1>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Nama</th>
            </tr>
          </thead>
          <tbody>
            {data.map((guru) => (
              <tr key={guru.id}>
                <td>{guru.id}</td>
                <td>
                  <Link href={`/guru/${guru.id}`}>{guru.username}</Link>
                </td>
                <td>{guru.nama}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link href="/guru/create">
        <a>Buat akun guru</a>
      </Link>
    </div>
  </Layout>
);

export default ListGuru;
