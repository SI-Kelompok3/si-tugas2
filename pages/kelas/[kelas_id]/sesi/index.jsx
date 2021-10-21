import React from "react";
import { useRouter } from "next/router";
import withAuth from "../../../../components/withAuth";

const SesiKelas = () => {
  const router = useRouter();
  const { kelas_id } = router.query;

  return <div>List sesi kelas, id : {kelas_id}</div>;
};

export default withAuth(SesiKelas);
