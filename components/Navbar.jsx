import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Image from 'next/image';

export default function Navbar() {
  const router = useRouter();
  const user = useMemo(() => {
    try {
      return JSON.parse(Cookies.get('user'));
    } catch {
      return null;
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('user');
    router.replace('/login');
  };

  return (
    <div>
      <header>
        <nav className="navbar">
          <Image
            src="/kursol-logo-white.png"
            alt="kursol"
            width="90"
            height="70"
          />
          <ul>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li>
              <Link href="/peserta">
                <a>Peserta</a>
              </Link>
            </li>
            <li>
              <Link href="/kelas">
                <a>Kelas</a>
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
            list-style: none;
            margin-left: 0;
            padding-left: 0;
          }

          li {
            margin-right: 1rem;
            display: flex;
            cursor: pointer !important;
          }

          li:first-child {
            margin-left: auto;
          }
        `}</style>
      </header>
    </div>
  );
}
