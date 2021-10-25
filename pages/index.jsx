import Link from "next/link";
import Layout from "../components/Layout";
import withAuth from "../components/withAuth";
import useFetch from "../lib/useFetch";
import { capitalizeFirstLetter } from "../lib/utility";

const Home = ({ user }) => {
  const [data, loading] = useFetch(
    [user],
    user.role === "peserta"
      ? `/api/peserta/${user.id}/kelas`
      : user.role === "admin"
      ? `/api/kelas/admin`
      : null
  );

  if (loading) return <p>Mohon tunggu</p>;

  return (
    <Layout>
      <h1>Selamat datang {user.nama}!</h1>
      {user.role === "peserta" && (
        <div>
          <b>Kelas yang diambil</b>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama</th>
                <th>Hari</th>
                <th>Waktu Mulai</th>
                <th>Waktu Akhir</th>
                <th>Jumlah Kehadiran</th>
                <th>Nilai</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((kelas, index) => (
                <tr key={kelas.id}>
                  <td>{index + 1}</td>
                  <td>
                    <Link href={`/kelas/${kelas.id}`}>{kelas.nama}</Link>
                  </td>
                  <td>{capitalizeFirstLetter(kelas.hari)}</td>
                  <td>{kelas.waktu_mulai}</td>
                  <td>{kelas.waktu_akhir}</td>
                  <td>{kelas.jumlah_kehadiran}</td>
                  <td>{kelas.nilai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {user.role === "admin" && (
        <div>
          <b>Kelas yang paling diminati</b>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama Kelas</th>
                <th>Jumlah Peserta</th>
              </tr>
            </thead>
            <tbody>
              {data.peserta.map((kelas, index) => (
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
          <b>Kelas dengan jumlah guru terendah</b>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama Kelas</th>
                <th>Jumlah Guru</th>
              </tr>
            </thead>
            <tbody>
              {data.guru.map((kelas, index) => (
                <tr key={kelas.id}>
                  <td>{index + 1}</td>
                  <td>
                    <Link href={`/kelas/${kelas.id}`}>{kelas.nama}</Link>
                  </td>
                  <td>{kelas.jumlah_guru}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ul>
        <li>
          <Link href="/peserta">Daftar Peserta</Link>
        </li>
        <li>
          <Link href="/kelas">Daftar Kelas</Link>
        </li>
        {user.role === "admin" && (
          <li>
            <Link href="/guru">Daftar Guru</Link>
          </li>
        )}
      </ul>
    </Layout>
  );
};

export default withAuth(Home);
