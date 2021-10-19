import React from "react";
import { useRouter } from "next/router";

export default function DetailPeserta() {
  const router = useRouter();
  const { peserta_id } = router.query;

  return <div>Detail Peserta, id : {peserta_id}</div>;
}
