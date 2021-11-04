import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';
import fetchJson from '../lib/fetchJson';
import withoutAuth from '../lib/withoutAuth';

export async function getServerSideProps(context) {
  return withoutAuth(context, () => ({ props: {} }));
}

const Login = () => {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    Cookies.set('user', JSON.stringify(user));
    router.replace('/');
  };

  return (
    <div>
      ini halaman login
      <form onSubmit={handleSubmit}>
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
      <Link href="/register">Belum punya akun? daftar dulu</Link>
    </div>
  );
};

export default Login;
