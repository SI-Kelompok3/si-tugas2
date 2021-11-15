import Link from 'next/link';
import Layout from '../components/Layout';
import { getKelasForPeserta, getTopGuru, getTopPeserta } from '../lib/queries';
import { capitalizeFirstLetter } from '../lib/utility';
import withAuth from '../lib/withAuth';

export async function getServerSideProps(context) {
  return withAuth(context, async (user) => {
    let data = null;
    switch (user.role) {
      case 'admin':
        const peserta = await getTopPeserta();
        const guru = await getTopGuru();
        data = {
          peserta,
          guru,
        };
        break;
      case 'peserta':
        const fetchedKelas = await getKelasForPeserta(user.id);
        const kelas = [];
        fetchedKelas.forEach((k) => {
          if (!k.id === null) kelas.push(k);
        });
        data = {
          data: kelas,
        };
        break;
      case 'guru':
        break;
    }

    return {
      props: {
        data,
        user,
      },
    };
  });
}

const Home = ({ data, user }) => (
  <Layout>
    <div className="homepage">
      <h1 className="welcome">Selamat datang, {user.nama}!</h1>
      {user.role === 'peserta' && (
        <div className="table-wrapper">
          <b>Kelas yang sudah berjalan</b>
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
                    <Link href={`/kelas/${kelas.id}`} passHref>
                      <a>{kelas.nama}</a>
                    </Link>
                  </td>
                  <td>{capitalizeFirstLetter(kelas.hari)}</td>
                  <td>{kelas.waktu_mulai}</td>
                  <td>{kelas.waktu_akhir}</td>
                  <td>{kelas.jumlah_kehadiran}</td>
                  <td>{kelas.nilai ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {user.role === 'admin' && (
        <div className="table-wrapper">
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
                    <Link href={`/kelas/${kelas.id}`} passHref>
                      <a>{kelas.nama}</a>
                    </Link>
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
                    <Link href={`/kelas/${kelas.id}`} passHref>
                      <a>{kelas.nama}</a>
                    </Link>
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
          <Link href="/peserta" passHref>
            <a className="link-daftar">Daftar Peserta</a>
          </Link>
        </li>
        <li>
          <Link href="/kelas" passHref>
            <a className="link-daftar">Daftar Kelas</a>
          </Link>
        </li>
        {user.role === 'admin' && (
          <li>
            <Link href="/guru" passHref>
              <a className="link-daftar">Daftar Guru</a>
            </Link>
          </li>
        )}
      </ul>
    </div>
  </Layout>
);

export default Home;
