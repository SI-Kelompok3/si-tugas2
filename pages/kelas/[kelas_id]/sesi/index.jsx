import React from 'react';
import Layout from '../../../../components/Layout';
import Link from 'next/link';
import withAuth from '../../../../lib/withAuth';
import { getSesiGuru, getSesiPeserta } from '../../../../lib/queries';

export async function getServerSideProps(context) {
  return withAuth(
    context,
    async (user) => {
      const { kelas_id } = context.params;
      let data = null;
      if (user.role === 'guru') {
        data = await getSesiGuru(kelas_id);
      } else {
        data = await getSesiPeserta(kelas_id, user.id);
      }
      return { props: { data, user, kelas_id } };
    },
    ['peserta', 'guru']
  );
}

const SesiKelas = ({ data, user, kelas_id }) => {
  return (
    <Layout>
      <h1>Daftar Sesi Kelas</h1>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Materi</th>
            <th>Tanggal</th>
            <th>Pengajar</th>
            <th>{user.role === 'guru' ? 'Jumlah Kehadiran' : 'Hadir'}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((sesi, index) => (
            <tr key={sesi.id}>
              <td>{index + 1}</td>
              <td>
                {user.role === 'guru' ? (
                  <Link
                    href={
                      user.role === 'guru'
                        ? `/kelas/${kelas_id}/sesi/${sesi.materi}/${sesi.tanggal}`
                        : '#'
                    }
                  >
                    {sesi.materi}
                  </Link>
                ) : (
                  sesi.materi
                )}
              </td>
              <td>{sesi.tanggal}</td>
              <td>{sesi.pengajar}</td>
              <td>
                {user.role === 'guru'
                  ? sesi.jumlah_kehadiran
                  : sesi.hadir === '0'
                  ? 'Tidak Hadir'
                  : 'Hadir'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default SesiKelas;
