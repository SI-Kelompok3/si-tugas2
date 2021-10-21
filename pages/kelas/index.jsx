import React from "react";
import Layout from "../../components/Layout";
import withAuth from "../../components/withAuth";
import useFetch from "../../lib/useFetch";

const Kelas = ({ user }) => {
  const [kelas, loading] = useFetch([], "/api/kelas", {
    headers: {
      "Content-Type": "application/json",
      role: user.role,
      user_id: user.id,
    },
  });

  //Header tabel
  const header = () => {
    switch (user.role) {
      case "admin":
        return (
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Durasi</th>
            <th>Deskripsi</th>
            <th>Waktu</th>
            <th>Hari</th>
            <th>Kapasitas</th>
            <th>Status</th>
          </tr>
        );
      case "guru":
        return (
          <tr>
            <th>No.</th>
            <th>Nama</th>
            <th>Hari</th>
            <th>Waktu Mulai</th>
            <th>Waktu Akhir</th>
          </tr>
        );
      case "peserta":
        return (
          <tr>
            <th>No.</th>
            <th>Nama</th>
            <th>Hari</th>
            <th>Waktu Mulai</th>
            <th>Waktu Akhir</th>
            <th>Terambil</th>
          </tr>
        );
    }
  };

  //Baris tabel
  const row = (item, index) => {
    switch (user.role) {
      case "admin":
        return (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.nama}</td>
            <td>{item.durasi}</td>
            <td>{item.deskripsi.substring(0, 20)}...</td>
            <td>{item.waktu}</td>
            <td>{item.hari}</td>
            <td>{item.kapasitas}</td>
            <td>{item.status}</td>
          </tr>
        );
      case "guru":
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.nama}</td>
            <td>{item.hari}</td>
            <td>{item.waktu_mulai}</td>
            <td>{item.waktu_akhir}</td>
          </tr>
        );
      case "peserta":
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.nama}</td>
            <td>{item.hari}</td>
            <td>{item.waktu_mulai}</td>
            <td>{item.waktu_akhir}</td>
            <td>{item.terambil === "0" ? "Tidak Terambil" : "Terambil"}</td>
          </tr>
        );
    }
  };

  return (
    <Layout>
      <p>TODO Fitur untuk admin : (Bentuk navigasinya gimana?)</p>
      <ul>
        <li>Jumlah peserta berdasarkan kelas</li>
        <li>Jumlah guru berdasarkan kelas</li>
        <li>Nilai rata-rata tiap kelas</li>
      </ul>
      <br />
      <h1>List kelas</h1>
      <table>
        <thead>{header()}</thead>
        <tbody>{!loading && kelas.data.map(row)}</tbody>
      </table>
    </Layout>
  );
};

export default withAuth(Kelas);
