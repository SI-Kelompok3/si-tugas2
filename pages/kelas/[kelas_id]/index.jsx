import React from "react";
import { useRouter } from "next/router";
import withAuth from "../../../components/withAuth";
import { capitalizeFirstLetter } from "../../../lib/utility";
import useFetch from "../../../lib/useFetch";
import Layout from "../../../components/Layout";
import Link from "next/link";

const DetailKelas = ({ user }) => {
  const router = useRouter();
  const { kelas_id } = router.query;
  const [data, loading] = useFetch([kelas_id], `/api/kelas/${kelas_id}`, {
    headers: {
      "Content-Type": "application/json",
      role: user.role,
      user_id: user.id,
    },
  });

  if (loading || !data) return <p>Mohon tunggu</p>;

  return (
    <Layout>
      <h1>{data.nama}</h1>
      <b>Deskripsi</b>
      <p>{data.deskripsi ?? "-"}</p>
      <b>Waktu</b>
      <p>
        {capitalizeFirstLetter(data.hari)}, {data.waktu}
      </p>
      <b>Durasi Kelas</b>
      <p>{data.durasi}</p>
      <b>Kapasitas</b>
      <p>{data.kapasitas} Peserta</p>
      {user.role === "admin" && (
        <>
          <b>Status</b>
          <p>{capitalizeFirstLetter(data.status)}</p>
          <b>Pengajar</b>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {data.guru.map((guru) => (
                <tr>
                  <td>{guru.id}</td>
                  <td>{guru.nama}</td>
                  <td>{guru.username}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link href={`/kelas/${kelas_id}/edit`}>Ubah kelas</Link>
        </>
      )}
      {user.role === "guru" && (
        <>
          <b>5 Peserta terbaik (nilai tertinggi)</b>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama</th>
                <th>Nilai</th>
              </tr>
            </thead>
            <tbody>
              {data.peserta.map((peserta, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{peserta.nama}</td>
                  <td>{peserta.nilai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {(user.role === "guru" || user.role === "peserta") && (
        <Link href={`/kelas/${kelas_id}/sesi`}>Lihat sesi</Link>
      )}
      {(user.role === "guru" || user.role === "admin") && (
        <Link href={`/kelas/${kelas_id}/peserta`}>Lihat peserta</Link>
      )}
      {user.role === "peserta" && (
        <div>
          <b>Nilai</b>
          <p>{data.nilai}</p>
        </div>
      )}
    </Layout>
  );
};

export default withAuth(DetailKelas);
