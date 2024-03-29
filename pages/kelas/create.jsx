/* eslint-disable react/no-unescaped-entities */
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import Layout from '../../components/Layout';
import fetchJson from '../../lib/fetchJson';
import { getGuru } from '../../lib/queries';
import withAuth from '../../lib/withAuth';

export async function getServerSideProps(context) {
  return withAuth(
    context,
    async () => {
      const guru = await getGuru();
      return {
        props: { guru },
      };
    },
    ['admin'],
  );
}

const CreateKelas = ({ guru }) => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [pengajar, setPengajar] = useState([]);

  const availableGuru = useMemo(
    () => guru.filter((g) => pengajar.indexOf(g) < 0),
    [guru, pengajar],
  );

  const handleAddPengajar = (e) => {
    if (e.target.value === '') return;

    setPengajar((state) => [
      ...state,
      guru.filter((g) => Number(g.id) === Number(e.target.value))[0],
    ]);
  };

  const handleHapusPengajar = (e) => {
    setPengajar((state) => state.filter((s) => Number(s.id) !== Number(e.target.id)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pengajar.length === 0) {
      setMessage('Mohon pilih salah satu guru sebagai pengajar!');
      return;
    }

    const {
      nama, durasi, deskripsi, waktu, hari, kapasitas, status,
    } = e.currentTarget;
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
    const create = await fetchJson('/api/kelas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setMessage(create.message);
    if (!create.error) {
      setPengajar([]);
      router.push(`/kelas/${create.id}`);
    }
  };

  return (
    <Layout>
      <div className="main kelas-baru-page">
        <h1>Buat kelas baru</h1>
        <form onSubmit={handleSubmit} className="kelas-baru-form">
          <label htmlFor="nama">Nama</label>
          <input type="text" name="nama" placeholder="Nama Kelas" required />
          <label htmlFor="durasi">Durasi</label>
          <input type="time" name="durasi" placeholder="Durasi" defaultValue="01:40:00" required />
          <label htmlFor="deskripsi">Deskripsi</label>
          <textarea name="deskripsi" cols="30" rows="3" placeholder="Deskripsi"></textarea>
          <label htmlFor="waktu">Waktu</label>
          <input
            type="time"
            name="waktu"
            placeholder="Waktu Mulai"
            defaultValue="07:00:00"
            required
          />
          <label htmlFor="hari">Pilih Hari</label>
          <select name="hari" defaultValue="senin" required>
            <option value="senin">Senin</option>
            <option value="selasa">Selasa</option>
            <option value="rabu">Rabu</option>
            <option value="kamis">Kamis</option>
            <option value="jumat">Jumat</option>
            <option value="sabtu">Sabtu</option>
            <option value="minggu">Minggu</option>
          </select>
          <label htmlFor="kapasitas">Kapasitas</label>
          <input type="number" name="kapasitas" placeholder="Kapasitas (Jumlah Peserta)" required />
          <select name="status" defaultValue="terbuka" disabled>
            <option value="terbuka">Terbuka</option>
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
        <div className="kelas-baru-details">
          <b>Penjelasan status:</b>
          <ul>
            <li>Terbuka : Peserta bisa daftar ke kelas</li>
            <li>Berjalan : Fitur "Terbuka" ditutup, guru bisa memulai sesi</li>
            <li>Selesai : Fitur "Berjalan" ditutup, guru memasukkan nilai peserta</li>
          </ul>
        </div>
        {message !== '' && <b>{message}</b>}
      </div>
    </Layout>
  );
};

export default CreateKelas;
