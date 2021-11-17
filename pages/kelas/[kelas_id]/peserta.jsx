import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import withAuth from '../../../lib/withAuth';
import {
  getPesertaForKelasAdminGuru,
  getPesertaForKelasPeserta,
  getKelasStatus,
} from '../../../lib/queries';
import fetchJson from '../../../lib/fetchJson';

export async function getServerSideProps(context) {
  return withAuth(context, async (user) => {
    const { kelas_id } = context.params;
    let data = null;
    const status = await getKelasStatus(kelas_id);
    if (user.role === 'admin' || user.role === 'guru') {
      data = await getPesertaForKelasAdminGuru(kelas_id);
    } else {
      data = await getPesertaForKelasPeserta(kelas_id);
    }
    return { props: { data, status, user } };
  });
}

const PesertaKelas = ({ data: initialData, status, user }) => {
  const router = useRouter();
  const [data, setData] = useState(initialData);

  const handleChangeNilai = (e) => setData((state) => {
    const newState = state;
    const mengikuti_id = e.target.id;
    const nilai = e.target.value;
    const index = newState.findIndex((p) => p.id === Number(mengikuti_id));
    newState[index] = { ...newState[index], nilai: Number(nilai) };
    return [...newState];
  });

  const handleSave = async () => {
    await fetchJson('/api/peserta', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    router.reload();
  };

  return (
    <Layout>
      <div className="main daftar-peserta-page">
        <h1>Daftar Peserta</h1>
        {user.role === 'guru' && data !== initialData && (
          <>
            <br />
            <button onClick={handleSave}>Simpan</button>
          </>
        )}
        {data.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nama</th>
                  <th>Jumlah Kehadiran</th>
                  <th>Nilai</th>
                </tr>
              </thead>
              <tbody>
                {data.map((peserta, index) => (
                  // aslinya mengikuti id
                  <tr key={peserta.id}>
                    <td>{index + 1}</td>
                    <td>{peserta.nama}</td>
                    <td>{peserta.jumlah_kehadiran}</td>
                    <td>
                      {user.role === 'guru' && status === 'selesai' ? (
                        <input
                          type="number"
                          value={peserta.nilai ?? 0}
                          onChange={handleChangeNilai}
                          id={peserta.id}
                          max={100}
                          min={0}
                        />
                      ) : (
                        peserta.nilai ?? '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Belum ada peserta yang mendaftar</p>
        )}
      </div>
    </Layout>
  );
};

export default PesertaKelas;
