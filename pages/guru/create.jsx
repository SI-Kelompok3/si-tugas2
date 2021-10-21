import React from "react";
import withAuth from "../../components/withAuth";

const CreateGuru = () => {
  return <div>Admin only, create guru</div>;
};

export default withAuth(CreateGuru);
