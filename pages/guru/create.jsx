import { useState } from 'react';
import Layout from '../../components/Layout';
import fetchJson from '../../lib/fetchJson';
import withAuth from '../../lib/withAuth';

export async function getServerSideProps(context) {
  return withAuth(context, () => ({ props: {} }), ['admin']);
}

const CreateGuru = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, nama, password } = e.currentTarget;
    const body = {
      username: username.value,
      nama: nama.value,
      password: password.value,
    };

    const create = await fetchJson('/api/guru', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setMessage(create.message);
    if (!create.error) {
      e.target.reset();
    }
  };

  return (
    <Layout>
      <div className="main buat-guru-page">
        <h1>Buat akun guru baru</h1>
        <form onSubmit={handleSubmit} className="buat-guru-form">
          <label htmlFor="username">Username</label>
          <input type="text" name="username" placeholder="Username" required />
          <label htmlFor="nama">Nama Lengkap</label>
          <input type="text" name="nama" placeholder="Nama Lengkap" required />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <input type="submit" value="Buat" />
        </form>
        {message !== '' && <b>{message}</b>}
      </div>
    </Layout>
  );
};

export default CreateGuru;
