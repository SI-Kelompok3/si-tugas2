import React from "react";
import { useRouter } from "next/router";

export default function PesertaKelas() {
  const router = useRouter();
  const { kelas_id } = router.query;

  return (
    <div>
      Guru only, list peserta kelas, id : {kelas_id}
      <p>Tabel peserta & ada jumlah kehadiran & nilai</p>
    </div>
  );
}
