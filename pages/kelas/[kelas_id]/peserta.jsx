import React from "react";
import { useRouter } from "next/router";

export default function PesertaKelas() {
  const router = useRouter();
  const { kelas_id } = router.query;

  return (
    <div>
      List peserta kelas, id : {kelas_id}
      <p>Untu</p>
    </div>
  );
}
