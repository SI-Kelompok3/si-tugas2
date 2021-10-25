import React from "react";
import { useRouter } from "next/router";
import withAuth from "../../../components/withAuth";
import withUserRole from "../../../components/withUserRole";
import useFetch from "../../../lib/useFetch";
import Layout from "../../../components/Layout";

const PesertaKelas = () => {
  const router = useRouter();
  const { kelas_id } = router.query;
  const [data, loading] = useFetch(
    [kelas_id],
    `/api/kelas/${kelas_id}/peserta`
  );

  if (loading) return <p>Mohon tunggu</p>;

  return (
    <Layout>
      <h1>Daftar Peserta</h1>
      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Jumlah Kehadiran</th>
            <th>Nilai</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((peserta, index) => (
            <tr key={index}>
              <td>{peserta.nama}</td>
              <td>{peserta.jumlah_kehadiran}</td>
              <td>{peserta.nilai}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default withAuth(PesertaKelas);
