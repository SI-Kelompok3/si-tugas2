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
      <p>TODO Fitur untuk guru : (Bentuk navigasinya gimana?)</p>
      <ul>
        <li>Top 5 peserta dengan nilai tertinggi</li>
      </ul>
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
      {user.role === "peserta" && (
        <>
          <b>Nilai</b>
          <p>{data.nilai}</p>
        </>
      )}
    </Layout>
  );
};

export default withAuth(DetailKelas);
