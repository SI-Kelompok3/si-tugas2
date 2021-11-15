import Link from 'next/link';
import Layout from '../../components/Layout';
import withAuth from '../../lib/withAuth';
import { getPesertaAdmin, getPesertaPesertaGuru } from '../../lib/queries';

export async function getServerSideProps(context) {
  return withAuth(context, async (user) => {
    let data = null;
    if (user.role === 'admin') {
      data = await getPesertaAdmin();
    } else {
      data = await getPesertaPesertaGuru();
    }
    return { props: { data, user } };
  });
}

const ListPeserta = ({ data, user }) => (
  <Layout>
    <div className="main peserta-page">
      <h1>List peserta</h1>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              {user.role === 'admin' && <th>Username</th>}
              <th>Nama</th>
            </tr>
          </thead>
          <tbody>
            {data.map((peserta, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                {user.role === 'admin' && (
                  <td>
                    <Link href={`/peserta/${peserta.id}`}>
                      {peserta.username}
                    </Link>
                  </td>
                )}
                <td>{peserta.nama}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </Layout>
);

export default ListPeserta;
