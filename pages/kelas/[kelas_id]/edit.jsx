/* eslint-disable react/no-unescaped-entities */
import { useState, useMemo } from 'react';
import Layout from '../../../components/Layout';
import fetchJson from '../../../lib/fetchJson';
import { getGuru, getKelasDetailAdmin } from '../../../lib/queries';
import withAuth from '../../../lib/withAuth';

export async function getServerSideProps(context) {
  return withAuth(
    context,
    async () => {
      const { kelas_id } = context.params;
      const allGuru = await getGuru();
      const data = await getKelasDetailAdmin(kelas_id);
      return { props: { data, allGuru, kelas_id } };
    },
    ['admin'],
  );
}

const EditKelas = ({ data, allGuru, kelas_id }) => {
  const [message, setMessage] = useState('');
  const [pengajar, setPengajar] = useState(data.guru);

  const availableGuru = useMemo(
    () => allGuru.filter((g) => pengajar.findIndex((p) => p.id === g.id) < 0),
    [allGuru, pengajar],
  );

  const handleAddPengajar = (e) => {
    if (e.target.value === '') return;

    setPengajar((state) => [
      ...state,
      allGuru.filter((g) => Number(g.id) === Number(e.target.value))[0],
    ]);
  };

  const handleHapusPengajar = (e) => {
    setPengajar((state) =>
      state.filter((s) => Number(s.id) !== Number(e.target.id)),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pengajar.length === 0) {
      setMessage('Mohon pilih salah satu guru sebagai pengajar!');
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
    const edit = await fetchJson(`/api/kelas/${kelas_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setMessage(edit.message);
    if (!edit.error) e.target.reset();
  };

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
        <select
          name="status"
          defaultValue={data.status}
          required
          disabled={data.status === 'selesai'}
        >
          {data.status === 'terbuka' && (
            <option value="terbuka">Terbuka</option>
          )}
          {data.status !== 'selesai' && (
            <option value="berjalan">Berjalan</option>
          )}
          {data.status !== 'terbuka' && (
            <option value="selesai">Selesai</option>
          )}
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
      <p>
        Perubahan status tidak bisa dikembalikan ke status sebelumnya, pastikan
        data sudah benar!
      </p>
      <ul>
        <li>Terbuka : Peserta bisa daftar ke kelas & admin bisa assign guru</li>
        <li>Berjalan : Fitur "Terbuka" ditutup, guru bisa memulai sesi</li>
        <li>
          Selesai : Fitur "Berjalan" ditutup, guru memasukkan nilai peserta
        </li>
      </ul>
      {message !== '' && <b>{message}</b>}
    </Layout>
  );
};

export default EditKelas;
