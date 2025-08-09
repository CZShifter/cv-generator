// pages/_document.tsx
import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';

function getLangFromPath(pathname: string | undefined) {
  if (!pathname) return 'cs';
  // bereme jen začátek cesty
  if (pathname.startsWith('/sk')) return 'sk';
  if (pathname.startsWith('/cs')) return 'cs';
  return 'cs';
}

class MyDocument extends Document<{ lang: 'cs' | 'sk' }> {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps & { lang: 'cs' | 'sk' }> {
    const initialProps = await Document.getInitialProps(ctx);
    // req?.url je spolehlivé na serveru
    const url = ctx.req?.url || '';
    const lang = getLangFromPath(url) as 'cs' | 'sk';
    return { ...initialProps, lang };
  }

  render() {
    const lang = (this.props as any).lang || 'cs';
    return (
      <Html lang={lang}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
