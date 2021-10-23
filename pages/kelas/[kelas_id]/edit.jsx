import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import withAuth from "../../../components/withAuth";
import withUserRole from "../../../components/withUserRole";
import useFetch from "../../../lib/useFetch";
import Layout from "../../../components/Layout";
import fetchJson from "../../../lib/fetchJson";

const EditKelas = () => {
  const router = useRouter();
  const { kelas_id } = router.query;

  const [message, setMessage] = useState("");
  const [pengajar, setPengajar] = useState([]);
  const [data, loading] = useFetch([kelas_id], `/api/kelas/${kelas_id}`, {
    headers: {
      "Content-Type": "application/json",
      role: "admin",
    },
  });

  const availableGuru = useMemo(() => {
    if (loading) return [];
    return data.guru.filter((g) => {
      return pengajar.indexOf(g) < 0;
    });
  }, [data, pengajar, loading]);

  useEffect(() => {
    if (!loading) setPengajar(data.guru);
  }, [data, loading]);

  const handleAddPengajar = (e) => {
    if (e.target.value === "") return;

    setPengajar((state) => [
      ...state,
      data.guru.filter((g) => Number(g.id) === Number(e.target.value))[0],
    ]);
  };

  const handleHapusPengajar = (e) => {
    setPengajar((state) =>
      state.filter((s) => Number(s.id) !== Number(e.target.id))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pengajar.length === 0) {
      setMessage("Mohon pilih salah satu guru sebagai pengajar!");
      return;
    }

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
      guru: pengajar,
    };
    const create = await fetchJson(`/api/kelas/${kelas_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setMessage(create.message);
    if (!create.error)
      e.target.reset();
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
          required
        />
        <input
          type="time"
          name="durasi"
          placeholder="Durasi"
          defaultValue="01:40:00"
          required
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
          required
        />
        <select name="hari" defaultValue={data.hari} required>
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
          required
        />
        <select name="status" defaultValue={data.status} required>
          <option value="terbuka">Terbuka</option>
          <option value="berjalan">Berjalan</option>
          <option value="selesai">Selesai</option>
        </select>
        <p>Pilih pengajar</p>
        <div>
          {pengajar.map((p) => (
            <div key={p.id}>
              <p>
                {p.username} - {p.nama}
              </p>
              <button key={p.id} id={p.id} onClick={handleHapusPengajar}>
                Hapus
              </button>
            </div>
          ))}
        </div>
        {availableGuru.length > 0 && (
          <select onChange={handleAddPengajar}>
            <option value="">-</option>
            {availableGuru.map((g) => (
              <option value={g.id} key={g.id}>
                {g.username} - {g.nama}
              </option>
            ))}
          </select>
        )}
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
