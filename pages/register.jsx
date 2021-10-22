// import fetchJson from "../lib/fetchJson";

import { useRef, useState } from "react";
import withoutAuth from "../components/withoutAuth";

const Register = () => {
  const [message, setMessage] = useState("");
  const form = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, nama } = e.currentTarget;
    const body = {
      username: username.value,
      password: password.value,
      nama: nama.value,
    };
    const create = await fetchJson("/api/peserta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setMessage(create.message);
    if (create.ok) form.current.reset();
  };

  return (
    <div>
      Buat akun peserta
      <form onSubmit={handleSubmit} ref={form}>
        <input type="text" name="username" required placeholder="Username" />
        <input type="text" name="nama" required placeholder="Nama Lengkap" />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
        />
        <input type="submit" value="Register" />
      </form>
      {message !== "" && <b>{message}</b>}
    </div>
  );
};

export default withoutAuth(Register);
