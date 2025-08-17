// pages/_document.tsx
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import { poppins, inter } from "@/styles/fonts";

type Lang = "cs" | "sk";

function getLangFromPath(pathname?: string): Lang {
  if (!pathname) return "cs";
  if (pathname.startsWith("/sk")) return "sk";
  if (pathname.startsWith("/cs")) return "cs";
  return "cs";
}

interface MyDocumentProps extends DocumentInitialProps {
  lang: Lang;
}

class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<MyDocumentProps> {
    const initialProps = await Document.getInitialProps(ctx);
    const url = ctx.req?.url ?? "";
    const lang = getLangFromPath(url);
    return { ...initialProps, lang };
  }

  render() {
    const { lang } = this.props;
    return (
      <Html lang={lang} className={`${poppins.className} ${inter.className}`}>
        <Head />
        <body >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
