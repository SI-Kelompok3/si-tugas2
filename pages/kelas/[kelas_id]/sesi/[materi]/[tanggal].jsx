import { useRouter } from "next/router";
import React from "react";
import withAuth from "../../../../../components/withAuth";
import withUserRole from "../../../../../components/withUserRole";
import Layout from "../../../../../components/Layout";
import useFetch from "../../../../../lib/useFetch";

const DetailSesi = () => {
  const router = useRouter();
  const { kelas_id, materi, tanggal } = router.query;

  const [data, loading] = useFetch(
    [materi, tanggal],
    `/api/kelas/${kelas_id}/sesi/${materi}/${tanggal}`
  );

  if (loading) return <p>Mohon tunggu</p>;

  return (
    <Layout>
      <h1>Daftar Kehadiran Peserta</h1>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama</th>
            <th>Hadir</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((peserta, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{peserta.nama}</td>
              <td>{peserta.hadir === "0" ? "Tidak Hadir" : "Hadir"}</td>
              <td>{peserta.keterangan ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default withAuth(withUserRole(DetailSesi, ["guru"]));
