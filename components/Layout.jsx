import React from "react";
import Head from "next/head";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>Kursol - SI Kelompok 3</title>
      </Head>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
