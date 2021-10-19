import React from "react";
import { useRouter } from "next/router";

export default function SesiKelas() {
  const router = useRouter();
  const { kelas_id } = router.query;

  return <div>List sesi kelas, id : {kelas_id}</div>;
}
