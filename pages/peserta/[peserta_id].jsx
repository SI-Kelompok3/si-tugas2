import React from "react";
import { useRouter } from "next/router";
import withAuth from "../../components/withAuth";
import useFetch from "../../lib/useFetch";
import Layout from "../../components/Layout";
import withUserRole from "../../components/withUserRole";

const DetailPeserta = () => {
  const router = useRouter();
  const { peserta_id } = router.query;
  const [data, loading] = useFetch([peserta_id], `/api/peserta/${peserta_id}`);

  if (loading) return <p>Mohon tunggu</p>;

  return (
    <Layout>
      <h3>{data.peserta.nama}</h3>
      <p>Username : {data.peserta.username}</p>
      <b>List kehadiran</b>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama</th>
            <th>Jumlah kehadiran</th>
          </tr>
        </thead>
        <tbody>
          {data.kehadiran.map((kh, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{kh.nama}</td>
              <td>{kh.jumlah_kehadiran}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default withAuth(withUserRole(DetailPeserta, ["admin"]));
