import React from "react";
import Layout from "../../components/Layout";
import withAuth from "../../components/withAuth";
import withUserRole from "../../components/withUserRole";
import useFetch from "../../lib/useFetch";
import Link from "next/link";

const ListKelasPeserta = () => {
  const [data, loading] = useFetch([], "/api/kelas/peserta");

  if (loading) return <p>Mohon tunggu</p>;

  return (
    <Layout>
      <h1>List jumlah peserta berdasarkan kelas</h1>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama Kelas</th>
            <th>Jumlah Peserta</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((kelas, index) => (
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
    </Layout>
  );
};

export default withAuth(withUserRole(ListKelasPeserta, ["admin"]));
