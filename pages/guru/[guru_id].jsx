import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { getGuruById } from '../../lib/queries';
import withAuth from '../../lib/withAuth';
import fetchJson from '../../lib/fetchJson';

export async function getServerSideProps(context) {
  return withAuth(
    context,
    async () => {
      const { guru_id } = context.params;

      const guru = await getGuruById(guru_id);
      return {
        props: { guru, guru_id },
      };
    },
    ['admin'],
  );
}

const EditGuru = ({ guru, guru_id }) => {
  const router = useRouter();
  const [message, setMessage] = useState('');

  const handleDeleteGuru = async () => {
    const deleteResult = await fetchJson(`/api/guru/${guru_id}`, {
      method: 'DELETE',
    });
    setMessage(deleteResult.message);
    if (!deleteResult.error) router.replace('/guru');
  };

  return (
    <Layout>
      <div className="main guru-detail-page">
        <h1>Detail Guru</h1>
        <div className="detail-guru-wrapper">
          <h3>{guru.nama}</h3>
          <p>Username : {guru.username}</p>
          <p>ID : {guru.id}</p>
          <button onClick={handleDeleteGuru}>Hapus akun guru</button>
          <b>{message}</b>
        </div>
      </div>
    </Layout>
  );
};

export default EditGuru;
