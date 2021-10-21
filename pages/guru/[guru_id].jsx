import React from "react";
import { useRouter } from "next/router";
import withAuth from "../../components/withAuth";

const EditGuru = () => {
  const router = useRouter();
  const { guru_id } = router.query;

  return <div>Edit / detail guru, id : {guru_id}</div>;
};

export default withAuth(EditGuru);
