import React from "react";
import { useRouter } from "next/router";

export default function DetailKelas() {
  const router = useRouter();
  const { kelas_id } = router.query;

  return <div>Detail kelas, id : {kelas_id}</div>;
}
