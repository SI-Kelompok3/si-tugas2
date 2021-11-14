/* eslint-disable react/no-unescaped-entities */
import { useRouter } from 'next/router';
import { useState } from 'react';
import moment from 'moment';
import Layout from '../../../../components/Layout';
import fetchJson from '../../../../lib/fetchJson';
import withAuth from '../../../../lib/withAuth';

export async function getServerSideProps(context) {
  return withAuth(
    context,
    async (user) => ({ props: { kelas_id: context.params.kelas_id, guru_id: user.id } }),
    ['guru'],
  );
}

const CreateSesi = ({ kelas_id, guru_id }) => {
  const router = useRouter();
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { materi, deskripsi } = e.currentTarget;
    const tanggal = moment().format('yyyy-MM-DD');
    const body = {
      materi: materi.value,
      deskripsi: deskripsi.value,
      tanggal,
      kelas_id,
      guru_id,
    };
    const create = await fetchJson('/api/sesi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setMessage(create.message);
    if (!create.error) {
      router.push(`/kelas/${kelas_id}/sesi/${encodeURIComponent(materi.value)}/${tanggal}`);
    }
  };

  return (
    <Layout>
      <h1>Buat kelas baru</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="materi" placeholder="Materi" required />
        <textarea name="deskripsi" cols="30" rows="3" placeholder="Deskripsi"></textarea>
        <input type="submit" value="Submit" />
      </form>
      {message !== '' && <b>{message}</b>}
    </Layout>
  );
};

export default CreateSesi;
