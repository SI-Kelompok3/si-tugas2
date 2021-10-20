import React from "react";
import Head from "next/head";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>Kursol - SI Kelompok 3</title>
      </Head>
      <Header />
      <main>{children}</main>
    </div>
  );
}
