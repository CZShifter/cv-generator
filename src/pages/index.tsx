import Head from "next/head";

export default function IndexFallback() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      {/* Volitelně krátké info nebo loader */}
      <noscript>Přesměrování…</noscript>
    </>
  );
}