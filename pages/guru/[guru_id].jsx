import React from "react";
import { useRouter } from "next/router";

export default function EditGuru() {
  const router = useRouter();
  const { guru_id } = router.query;

  return <div>Edit / detail guru, id : {guru_id}</div>;
}
