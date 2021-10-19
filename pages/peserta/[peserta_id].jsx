import React from "react";
import { useRouter } from "next/router";

export default function DetailPeserta() {
  const router = useRouter();
  const { peserta_id } = router.query;

  return (
    <div>
      Admin only, detail Peserta, id : {peserta_id}
      <p>Bisa lihat kehadirannya</p>
    </div>
  );
}
