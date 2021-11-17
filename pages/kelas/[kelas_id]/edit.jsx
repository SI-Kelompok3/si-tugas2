/* eslint-disable react/no-unescaped-entities */
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../../../components/Layout';
import fetchJson from '../../../lib/fetchJson';
import { getKelasDetailAdmin } from '../../../lib/queries';
import withAuth from '../../../lib/withAuth';

export async function getServerSideProps(context) {
  return withAuth(
    context,
    async () => {
      const { kelas_id } = context.params;
      const data = await getKelasDetailAdmin(kelas_id);
      return { props: { data, kelas_id } };
    },
    ['admin'],
  );
}

const EditKelas = ({ data, kelas_id }) => {
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      nama, durasi, deskripsi, waktu, hari, status,
    } = e.currentTarget;
    const body = {
      id: kelas_id,
      nama: nama.value,
      durasi: durasi.value,
      deskripsi: deskripsi.value,
      waktu: waktu.value,
      hari: hari.value,
      status: status.value,
      guru: data.guru,
    };
    const edit = await fetchJson(`/api/kelas/${kelas_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setMessage(edit.message);
    router.push(`/kelas/${kelas_id}`);
  };

  return (
    <Layout>
      <div className="main">
        <h1>Ubah kelas</h1>
        <form onSubmit={handleSubmit} className="ubah-kelas-form">
          <label htmlFor="nama">Nama</label>
          <input
            type="text"
            name="nama"
            placeholder="Nama Kelas"
            defaultValue={data.nama}
            required
          />
          <label htmlFor="durasi">Durasi</label>
          <input type="time" name="durasi" placeholder="Durasi" defaultValue="01:40:00" required />
          <label htmlFor="deskripsi">Deskripsi</label>
          <textarea
            name="deskripsi"
            cols="30"
            rows="3"
            placeholder="Deskripsi"
            defaultValue={data.deskripsi}
          ></textarea>
          <label htmlFor="waktu">Waktu</label>
          <input
            type="time"
            name="waktu"
            placeholder="Waktu Mulai"
            defaultValue={data.waktu}
            required
          />
          <label htmlFor="hari">Hari</label>
          <select name="hari" defaultValue={data.hari} required>
            <option value="senin">Senin</option>
            <option value="selasa">Selasa</option>
            <option value="rabu">Rabu</option>
            <option value="kamis">Kamis</option>
            <option value="jumat">Jumat</option>
            <option value="sabtu">Sabtu</option>
            <option value="minggu">Minggu</option>
          </select>
          <label htmlFor="kapasitas">Kapasitas</label>
          <input
            type="number"
            name="kapasitas"
            placeholder="Kapasitas (Jumlah Peserta)"
            defaultValue={data.kapasitas}
            required
            disabled
          />
          <label htmlFor="status">Status</label>
          <select
            name="status"
            defaultValue={data.status}
            required
            disabled={data.status === 'selesai'}
          >
            {data.status === 'terbuka' && <option value="terbuka">Terbuka</option>}
            {data.status !== 'selesai' && <option value="berjalan">Berjalan</option>}
            {data.status !== 'terbuka' && <option value="selesai">Selesai</option>}
          </select>
          <p>Pengajar:</p>
          <div style={{ marginBottom: '1rem' }}>
            {data.guru.map((g) => (
              <div key={g.id}>
                <p>
                  {g.username} - {g.nama}
                </p>
              </div>
            ))}
          </div>
          <input type="submit" value="Submit" />
        </form>
        <div className="kelas-baru-details">
          <b>Penjelasan status</b>
          <p>
            Perubahan status tidak bisa dikembalikan ke status sebelumnya, pastikan data sudah
            benar!
          </p>
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

export default EditKelas;
