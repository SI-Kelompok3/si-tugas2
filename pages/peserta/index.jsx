import Layout from "../../components/Layout";
import withAuth from "../../components/withAuth";
import useFetch from "../../lib/useFetch";
import Link from "next/link";

const ListPeserta = ({ user }) => {
  const [peserta, loading] = useFetch([], "/api/peserta", {
    headers: { "Content-Type": "application/json", role: user.role },
  });

  return (
    <Layout>
      <h1>List peserta</h1>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            {user.role === "admin" && <th>Username</th>}
            <th>Nama</th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            peserta.data.map((peserta, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                {user.role === "admin" && (
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
    </Layout>
  );
};

export default withAuth(ListPeserta);
