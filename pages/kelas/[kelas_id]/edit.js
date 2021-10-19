import React from "react";
import { useRouter } from "next/router";

export default function EditKelas() {
  const router = useRouter();
  const { kelas_id } = router.query;

  return <div>Admin only, Edit kelas, id : {kelas_id}</div>;
}
