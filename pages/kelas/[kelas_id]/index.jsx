import React from "react";
import { useRouter } from "next/router";
import withAuth from "../../../components/withAuth";

const DetailKelas = () => {
  const router = useRouter();
  const { kelas_id } = router.query;

  return (
    <div>
      Detail kelas, id : {kelas_id}
      <p>Untuk guru bisa lihat top 5 peserta dengan nilai tertinggi</p>
    </div>
  );
};

export default withAuth(DetailKelas);
