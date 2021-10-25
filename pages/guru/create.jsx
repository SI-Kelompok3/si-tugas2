import { useState } from "react";
import withAuth from "../../components/withAuth";
import withUserRole from "../../components/withUserRole";
import Layout from "../../components/Layout";
import fetchJson from "../../lib/fetchJson";

const CreateGuru = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, nama, password } = e.currentTarget;
    const body = {
      username: username.value,
      nama: nama.value,
      password: password.value,
    };

    const create = await fetchJson("/api/guru", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setMessage(create.message);
    if (!create.error) {
      e.target.reset();
    }
  };

  return (
    <Layout>
      <h1>Buat akun guru baru</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" required />
        <input type="text" name="nama" placeholder="Nama Lengkap" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <input type="submit" value="Buat" />
      </form>

      {message !== "" && <b>{message}</b>}
    </Layout>
  );
};

export default withAuth(withUserRole(CreateGuru, ["admin"]));
