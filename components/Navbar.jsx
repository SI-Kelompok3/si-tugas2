import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("user"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            {!user && (
              <li>
                <Link href="/login">
                  <a>Login</a>
                </Link>
              </li>
            )}
            {user && (
              <>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </nav>
        <style jsx>{`
          ul {
            display: flex;
            list-style: none;
            margin-left: 0;
            padding-left: 0;
          }

          li {
            margin-right: 1rem;
            display: flex;
          }

          li:first-child {
            margin-left: auto;
          }

          header {
            padding: 0.2rem;
            color: #fff;
            background-color: #333;
          }
        `}</style>
      </header>
    </div>
  );
}
