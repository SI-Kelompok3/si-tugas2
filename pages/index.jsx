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
    <h1>Selamat datang {user.nama}!</h1>
    {user.role === 'peserta' && (
      <div>
        {data.data.length > 0 ? (
          <>
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
                      <Link href={`/kelas/${kelas.id}`}>{kelas.nama}</Link>
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
          </>
        ) : (
          <p>Belum ada kelas yang aktif</p>
        )}
      </div>
    )}
    {user.role === 'admin' && (
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
      {user.role === 'admin' && (
        <li>
          <Link href="/guru">Daftar Guru</Link>
        </li>
      )}
    </ul>
  </Layout>
);

export default Home;
