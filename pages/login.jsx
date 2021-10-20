import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useUser from "../lib/useUser";
import fetchJson from "../lib/fetchJson";
import Link from "next/link";

export default function Login() {
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
    const { username, password, role } = e.currentTarget;
    const body = {
      username: username.value,
      password: password.value,
      role: role.value,
    };
    try {
      mutateUser(
        await fetchJson("/api/login", {
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
      ini halaman login
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" required placeholder="Username" />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
        />
        <select name="role" defaultValue="peserta">
          <option value="peserta">Peserta</option>
          <option value="guru">Guru</option>
          <option value="admin">Admin</option>
        </select>
        <input type="submit" value="Log in" />
      </form>
      <Link href="/register">Belum punya akun? daftar dulu</Link>
    </div>
  );
}
