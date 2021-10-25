import React from "react";
import { useRouter } from "next/router";
import withAuth from "../../../../components/withAuth";
import withUserRole from "../../../../components/withUserRole";
import useFetch from "../../../../lib/useFetch";
import Layout from "../../../../components/Layout";
import Link from "next/link";

const SesiKelas = ({ user }) => {
  const router = useRouter();
  const { kelas_id } = router.query;

  const [data, loading] = useFetch([kelas_id], `/api/kelas/${kelas_id}/sesi`, {
    headers: {
      "Content-Type": "application/json",
      role: user.role,
      user_id: user.id,
    },
  });

  if (loading) return <p>Mohon tunggu</p>;

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
                    href={
                      user.role === "guru"
                        ? `/kelas/${kelas_id}/sesi/${sesi.materi}/${sesi.tanggal}`
                        : "#"
                    }
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
