import Link from "next/link";
import Layout from "../components/Layout";
import withAuth from "../components/withAuth";

const Home = ({ user }) => {
  return (
    <Layout>
      <p>User terlogin : {JSON.stringify(user)}</p>
      {user && (
        <div>
          <p>Selamat datang! {user.nama}</p>
          {user.role === "peserta" && <p>Dashboard peserta</p>}
          {user.role === "guru" && <p>Dashboard guru</p>}
          {user.role === "admin" && (
            <div>
              <p>Dashboard admin</p>
              <ul>
                <li>Tabel top 5 kelas dengan peserta terbanyak</li>
                <li>Tabel top 5 kelas dengan guru sedikit</li>
              </ul>
            </div>
          )}
          <ul>
            <li>
              <Link href="/peserta">Daftar Peserta</Link>
            </li>
            <li>
              <Link href="/kelas">Daftar Kelas</Link>
            </li>
          </ul>
        </div>
      )}
    </Layout>
  );
};

export default withAuth(Home);
