import { useRef, useState } from "react";
import Layout from "../../components/Layout";
import withAuth from "../../components/withAuth";
import withUserRole from "../../components/withUserRole";
import fetchJson from "../../lib/fetchJson";

const CreateKelas = () => {
  const [message, setMessage] = useState("");
  const form = useRef(null);

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
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setMessage(create.message);
    if (create.ok) form.current.reset();
  };

  return (
    <Layout>
      <h1>Buat kelas baru</h1>
      <form onSubmit={handleSubmit} ref={form}>
        <input type="text" name="nama" placeholder="Nama Kelas" />
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
        ></textarea>
        <input
          type="time"
          name="waktu"
          placeholder="Waktu Mulai"
          defaultValue="07:00:00"
        />
        <select name="hari" defaultValue="senin">
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
        />
        <select name="status" defaultValue="terbuka">
          <option value="terbuka">Terbuka</option>
          <option value="berjalan">Berjalan</option>
          <option value="selesai">Selesai</option>
        </select>
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

export default withAuth(withUserRole(CreateKelas, "admin"));
