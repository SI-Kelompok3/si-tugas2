import { useState } from "react";
import { useRouter } from "next/router";
import withAuth from "../../../components/withAuth";
import withUserRole from "../../../components/withUserRole";
import useFetch from "../../../lib/useFetch";
import Layout from "../../../components/Layout";

const EditKelas = () => {
  const router = useRouter();
  const { kelas_id } = router.query;
  const [data, loading] = useFetch([kelas_id], `/api/kelas/${kelas_id}`, {
    headers: {
      "Content-Type": "application/json",
      role: "admin",
    },
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nama, durasi, deskripsi, waktu, hari, kapasitas, status } =
      e.currentTarget;
    const body = {
      nama: nama.value,
      durasi: durasi.value,
      deskripsi: deskripsi.value,
      waktu: waktu.value,
      hari: hari.value,
      kapasitas: kapasitas.value,
      status: status.value,
    };
    const create = await fetchJson("/api/kelas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setMessage(create.message);
    if (!create.error) e.target.reset();
  };

  if (loading || !data) return <p>Mohon tunggu</p>;

  return (
    <Layout>
      <h1>Ubah kelas</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nama"
          placeholder="Nama Kelas"
          defaultValue={data.nama}
        />
        <input
          type="time"
          name="durasi"
          placeholder="Durasi"
          defaultValue="01:40:00"
        />
        <textarea
          name="deskripsi"
          cols="30"
          rows="3"
          placeholder="Deskripsi"
          defaultValue={data.deskripsi}
        ></textarea>
        <input
          type="time"
          name="waktu"
          placeholder="Waktu Mulai"
          defaultValue={data.waktu}
        />
        <select name="hari" defaultValue={data.hari}>
          <option value="senin">Senin</option>
          <option value="selasa">Selasa</option>
          <option value="rabu">Rabu</option>
          <option value="kamis">Kamis</option>
          <option value="jumat">Jumat</option>
          <option value="sabtu">Sabtu</option>
          <option value="minggu">Minggu</option>
        </select>
        <input
          type="number"
          name="kapasitas"
          placeholder="Kapasitas (Jumlah Peserta)"
          defaultValue={data.kapasitas}
        />
        <select name="status" defaultValue={data.status}>
          <option value="terbuka">Terbuka</option>
          <option value="berjalan">Berjalan</option>
          <option value="selesai">Selesai</option>
        </select>
        <p>TODO Fitur untuk admin : nambahin guru ke kelas</p>
        <input type="submit" value="Submit" />
      </form>
      <b>Penjelasan status</b>
      <ul>
        <li>Terbuka : Peserta bisa daftar ke kelas & admin bisa assign guru</li>
        <li>Berjalan : Fitur "Terbuka" ditutup, guru bisa memulai sesi</li>
        <li>
          Selesai : Fitur "Berjalan" ditutup, guru memasukkan nilai peserta
        </li>
      </ul>
      {message !== "" && <b>{message}</b>}
    </Layout>
  );
};

export default withAuth(withUserRole(EditKelas, ["admin"]));
