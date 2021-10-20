import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useUser from "../lib/useUser";
import fetchJson from "../lib/fetchJson";

export default function Register() {
  const router = useRouter();
  const { user, mutateUser } = useUser({
    redirectTo: "/",
    redirectIfFound: true,
  });

  useEffect(() => {
    if (user && user.isLoggedIn) router.replace("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, nama } = e.currentTarget;
    const body = {
      username: username.value,
      password: password.value,
      nama: nama.value,
    };
    try {
      mutateUser(
        await fetchJson("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      );
    } catch (error) {
      console.error("An unexpected error happened:", error);
    }
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
}
