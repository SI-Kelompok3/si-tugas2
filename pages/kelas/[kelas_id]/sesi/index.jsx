import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import Layout from '../../../../components/Layout';
import withAuth from '../../../../lib/withAuth';
import { getKelasStatus, getSesiGuru, getSesiPeserta } from '../../../../lib/queries';

export async function getServerSideProps(context) {
  return withAuth(
    context,
    async (user) => {
      const { kelas_id } = context.params;
      let data = null;
      const status = await getKelasStatus(kelas_id);
      if (user.role === 'guru') {
        data = await getSesiGuru(kelas_id);
      } else {
        data = await getSesiPeserta(kelas_id, user.id);
      }
      return {
        props: {
          data,
          user,
          kelas_id,
          status,
        },
      };
    },
    ['peserta', 'guru'],
  );
}

const SesiKelas = ({
  data, user, kelas_id, status,
}) => {
  const hadirColumn = (sesi) => {
    if (user.role === 'guru') return sesi.jumlah_kehadiran;

    if (sesi.hadir === '0') return 'Tidak Hadir';

    return 'Hadir';
  };

  return (
    <Layout>
      <div className="main sesi-kelas-page">
        <h1>Daftar Sesi Kelas</h1>
        {user.role === 'guru' && status === 'berjalan' && (
          <Link href={`/kelas/${kelas_id}/sesi/create`}>Buat sesi</Link>
        )}
        {data.length > 0 ? (
          <div className="table-wrapper">
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
                              ? `/kelas/${kelas_id}/sesi/${encodeURIComponent(sesi.materi)}/${
                                sesi.tanggal
                              }`
                              : '#'
                          }
                        >
                          {sesi.materi}
                        </Link>
                      ) : (
                        sesi.materi
                      )}
                    </td>
                    <td>{moment(sesi.tanggal).format('DD-MM-yyyy')}</td>
                    <td>{sesi.pengajar}</td>
                    <td>{hadirColumn(sesi)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Belum ada sesi</p>
        )}
      </div>
    </Layout>
  );
};

export default SesiKelas;
