import React from "react";
import withAuth from "../../components/withAuth";

const Kelas = () => {
  return (
    <div>
      <p>Fitur untuk admin : </p>
      <ul>
        <li>Jumlah peserta berdasarkan kelas</li>
        <li>Jumlah guru berdasarkan kelas</li>
        <li>Nilai rata-rata tiap kelas</li>
      </ul>
      <br />
      <p>Untuk guru tampilkan kelas yang diampu saja</p>
    </div>
  );
};

export default withAuth(Kelas);
