import React from "react";
import Layout from "../../components/Layout";
import withAuth from "../../components/withAuth";
import withUserRole from "../../components/withUserRole";
import useFetch from "../../lib/useFetch";
import Link from "next/link";

const ListKelasNilai = () => {
  const [data, loading] = useFetch([], "/api/kelas/nilai");

  if (loading) return <p>Mohon tunggu</p>;

  return (
    <Layout>
      <h1>List nilai rata-rata tiap kelas</h1>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama Kelas</th>
            <th>Nilai Rerata</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((kelas, index) => (
            <tr key={kelas.id}>
              <td>{index + 1}</td>
              <td>
                <Link href={`/kelas/${kelas.id}`}>{kelas.nama}</Link>
              </td>
              <td>{kelas.nilai}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default withAuth(withUserRole(ListKelasNilai, ["admin"]));
