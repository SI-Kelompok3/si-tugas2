// import fetchJson from "../lib/fetchJson";

import withoutAuth from "../components/withoutAuth";

const Register = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, nama } = e.currentTarget;
    const body = {
      username: username.value,
      password: password.value,
      nama: nama.value,
    };
    const user = await fetchJson("/api/peserta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  return (
    <div>
      Buat akun peserta
      <form onSubmit={handleSubmit}>
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
    </div>
  );
};

export default withoutAuth(Register);
