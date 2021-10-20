import React from "react";
import Layout from "../components/Layout";
import useUser from "../lib/useUser";

export default function Home() {
  const { user } = useUser();

  return (
    <Layout>
      <p>User terlogin : {JSON.stringify(user)}</p>
      <p>Selamat datang! {user.nama}</p>
      {user.role === "peserta" && <p>Dashboard peserta</p>}
      {user.role === "guru" && <p>Dashboard guru</p>}
      {user.role === "admin" && (
        <div>
          <p>Dashboard admin</p>
          <ul>
            <li>Tabel top 5 kelas dengan peserta terbanyak</li>
            <li>Tabel top 5 kelas dengan guru sedikit</li>
          </ul>
        </div>
      )}
    </Layout>
  );
}
