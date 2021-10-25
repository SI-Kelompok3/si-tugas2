import React from "react";
import { useRouter } from "next/router";
import withAuth from "../../components/withAuth";
import useFetch from "../../lib/useFetch";
import Layout from "../../components/Layout";
import withUserRole from "../../components/withUserRole";

const EditGuru = () => {
  const router = useRouter();
  const { guru_id } = router.query;

  const [guru, loading] = useFetch([guru_id], `/api/guru/${guru_id}`);

  if (loading) return <p>Mohon tunggu</p>;

  return (
    <Layout>
      <h1>Detail Guru</h1>
      <h3>{guru.nama}</h3>
      <p>Username : {guru.username}</p>
      <p>ID : {guru.id}</p>
    </Layout>
  );
};

export default withAuth(withUserRole(EditGuru, ["admin"]));
