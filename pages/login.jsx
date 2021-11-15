import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import fetchJson from '../lib/fetchJson';
import withoutAuth from '../lib/withoutAuth';

export async function getServerSideProps(context) {
  return withoutAuth(context, () => ({ props: {} }));
}

const Login = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const { username, password, role } = e.currentTarget;
    const body = {
      username: username.value,
      password: password.value,
      role: role.value,
    };
    const user = await fetchJson('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (user.error) {
      return setMessage(user.message);
    }
    Cookies.set('user', JSON.stringify(user));
    router.replace('/');
  };

  return (
    <div className="login">
      <div className="title-wrapper">
        <Image src="/kursol-logo.png" alt="kursol" width="100px" height="90" />
        <div className="details">
          <h1>Selamat Datang,</h1>
          <h2>Silahkan login dahulu ➡</h2>
        </div>
      </div>
      <div className="form-wrapper">
        <Image src="/user.svg" alt="kursol" width="100px" height="90" />
        <form onSubmit={handleSubmit} className="login-form">
          <input type="text" name="username" required placeholder="Username" />
          <input
            type="password"
            name="password"
            required
            placeholder="Password"
          />
          <select name="role" defaultValue="peserta">
            <option value="peserta">Peserta</option>
            <option value="guru">Guru</option>
            <option value="admin">Admin</option>
          </select>
          <input type="submit" value="Log in" />
        </form>
        <Link href="/register">
          <a className="register-link">Belum punya akun? daftar dulu</a>
        </Link>
        {message !== '' && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Login;
