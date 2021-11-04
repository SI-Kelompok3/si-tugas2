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
    <h1>List Guru</h1>
    <Link href="/guru/create">Buat akun guru</Link>
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
  </Layout>
);

export default ListGuru;
