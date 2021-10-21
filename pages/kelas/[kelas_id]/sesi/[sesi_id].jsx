import React from "react";
import { useRouter } from "next/router";
import withAuth from "../../../../components/withAuth";

const DetailSesiKelas = () => {
  const router = useRouter();
  const { kelas_id, sesi_id } = router.query;

  return (
    <div>
      Detail sesi kelas, id : {kelas_id}, sesi id : {sesi_id}
    </div>
  );
};

export default withAuth(DetailSesiKelas);
