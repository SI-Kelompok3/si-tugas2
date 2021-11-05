import React from "react";
import Layout from "../../components/Layout";
import { getGuruById } from "../../lib/queries";
import withAuth from "../../lib/withAuth";

export async function getServerSideProps(context) {
  return withAuth(
    context,
    async () => {
      const guru = await getGuruById(context.params.guru_id);
      return {
        props: { guru },
      };
    },
    ["admin"]
  );
}

const EditGuru = ({ guru }) => (
  <Layout>
    <h1>Detail Guru</h1>
    <h3>{guru.nama}</h3>
    <p>Username : {guru.username}</p>
    <p>ID : {guru.id}</p>
  </Layout>
);

export default EditGuru;
