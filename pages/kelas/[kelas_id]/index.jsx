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
      <p>TODO Fitur untuk admin</p>
      <ul>
        <li>Liat guru yang diassign ke guru ini</li>
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
