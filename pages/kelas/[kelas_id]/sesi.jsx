import React from "react";
import { useRouter } from "next/router";
import withAuth from "../../../components/withAuth";
import withUserRole from "../../../components/withUserRole";
import useFetch from "../../../lib/useFetch";
import Layout from "../../../components/Layout";
import Link from "next/link";

const SesiKelas = ({ user }) => {
  const router = useRouter();
  const { kelas_id, materi, tanggal } = router.query;

  const [data, loading] = useFetch(
    [kelas_id, materi, tanggal],
    `/api/kelas/${kelas_id}/sesi`,
    {
      headers: {
        "Content-Type": "application/json",
        role: user.role,
        user_id: user.id,
        materi,
        tanggal,
      },
    }
  );

  if (loading) return <p>Mohon tunggu</p>;

  if (materi && tanggal)
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

  return (
    <Layout>
      <h1>Daftar Sesi Kelas</h1>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Materi</th>
            <th>Tanggal</th>
            <th>Pengajar</th>
            <th>{user.role === "guru" ? "Jumlah Kehadiran" : "Hadir"}</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((sesi, index) => (
            <tr key={sesi.id}>
              <td>{index + 1}</td>
              <td>
                {user.role === "guru" ? (
                  <Link
                    href={{
                      pathname: `/kelas/${kelas_id}/sesi`,
                      query: {
                        materi: sesi.materi,
                        tanggal: sesi.tanggal,
                      },
                    }}
                  >
                    {sesi.materi}
                  </Link>
                ) : (
                  sesi.materi
                )}
              </td>
              <td>{sesi.tanggal}</td>
              <td>{sesi.pengajar}</td>
              <td>
                {user.role === "guru"
                  ? sesi.jumlah_kehadiran
                  : sesi.hadir === "0"
                  ? "Tidak Hadir"
                  : "Hadir"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default withAuth(withUserRole(SesiKelas, ["peserta", "guru"]));
