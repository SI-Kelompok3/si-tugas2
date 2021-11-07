import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Layout from '../../../../../components/Layout';
import fetchJson from '../../../../../lib/fetchJson';
import { getSesiDetail } from '../../../../../lib/queries';
import withAuth from '../../../../../lib/withAuth';

export async function getServerSideProps(context) {
  return withAuth(
    context,
    async () => {
      const { materi, tanggal } = context.params;
      const data = await getSesiDetail(materi, tanggal);
      return {
        props: {
          data: data.map((d) => ({
            ...d,
            hadir: d.hadir !== 0,
          })),
        },
      };
    },
    ['guru'],
  );
}

const DetailSesi = ({ data: initialData }) => {
  const router = useRouter();
  const [data, setData] = useState(initialData);

  const handleChangeKehadiran = (hadir, mengikuti_id) => setData((state) => {
    const newState = state;
    const index = newState.findIndex((p) => p.mengikuti_id === mengikuti_id);
    newState[index] = { ...newState[index], hadir };
    return [...newState];
  });

  const handleChangeKeterangan = (e) => setData((state) => {
    const newState = state;
    const index = newState.findIndex((p) => p.mengikuti_id === Number(e.target.id));
    newState[index] = { ...newState[index], keterangan: e.target.value };
    return [...newState];
  });

  const handleKehadiranSemua = (hadir) => setData((state) => {
    const newState = state.map((s) => ({ ...s, hadir }));
    return [...newState];
  });

  const handleSave = async () => {
    await fetchJson('/api/sesi', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    router.reload();
  };

  return (
    <Layout>
      <h1>Daftar Kehadiran Peserta</h1>
      {data !== initialData && (
        <>
          <button onClick={handleSave}>Simpan</button>
          <br />
        </>
      )}
      <button onClick={() => handleKehadiranSemua(true)}>Hadir semua</button>
      <button onClick={() => handleKehadiranSemua(false)}>Tidak hadir semua</button>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama</th>
            <th>Kehadiran</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {data.map((peserta, index) => (
            <tr key={peserta.mengikuti_id}>
              <td>{index + 1}</td>
              <td>{peserta.nama}</td>
              <td>
                <button
                  disabled={!peserta.hadir}
                  onClick={() => handleChangeKehadiran(false, peserta.mengikuti_id)}
                >
                  X
                </button>
                <button
                  disabled={peserta.hadir}
                  onClick={() => handleChangeKehadiran(true, peserta.mengikuti_id)}
                >
                  V
                </button>
                {peserta.hadir ? 'Hadir' : 'Tidak Hadir'}
              </td>
              <td>
                <input
                  type="text"
                  id={peserta.mengikuti_id}
                  onChange={handleChangeKeterangan}
                  placeholder="Misal : Sakit, Ijin"
                  value={peserta.keterangan ?? ''}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default DetailSesi;
