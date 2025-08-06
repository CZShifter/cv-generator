import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="cs">
      <Head>
      </Head>
      <body>
        <Main />         {/* Tady bude <div id="__next">...</div> */}
        <NextScript />   {/* Next.js potřebné skripty */}
      </body>
    </Html>
  );
}
