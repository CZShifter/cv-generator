import { RiTelegram2Line, RiFacebookCircleLine } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { LiaLinkedinIn } from "react-icons/lia";
import styles from "@/scss/BlogPost.module.scss";

type BlogShareBoxProps = {
  url: string;
  title: string;
  locale: "cs" | "sk";
};

const copy = {
  cs: {
    title: "Sdílejte tento článek s ostatními.",
    facebook: "Sdílet na Facebooku",
    x: "Sdílet na X",
    whatsapp: "Sdílet na WhatsAppu",
    telegram: "Sdílet na Telegramu",
    linkedin: "Sdílet na LinkedInu",
  },
  sk: {
    title: "Zdieľajte tento článok s ostatnými.",
    facebook: "Zdieľať na Facebooku",
    x: "Zdieľať na X",
    whatsapp: "Zdieľať na WhatsApp",
    telegram: "Zdieľať na Telegrame",
    linkedin: "Zdieľať na LinkedIne",
  },
};

export default function BlogShareBox({ url, title, locale }: BlogShareBoxProps) {
  const shareUrlEncoded = encodeURIComponent(url);
  const shareTextEncoded = encodeURIComponent(title);
  const shareWhatsappEncoded = encodeURIComponent(`${title} ${url}`);

  return (
    <div className={styles.blogShareBox}>
      <div className={styles.blogShareLinks}>
        <a
          className={styles.blogShareLink}
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrlEncoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={copy[locale].facebook}
        >
          <RiFacebookCircleLine />
        </a>
        <a
          className={styles.blogShareLink}
          href={`https://twitter.com/intent/tweet?url=${shareUrlEncoded}&text=${shareTextEncoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={copy[locale].x}
        >
          <FaXTwitter className={styles.blogShareXIcon} />
        </a>
        <a
          className={styles.blogShareLink}
          href={`https://wa.me/?text=${shareWhatsappEncoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={copy[locale].whatsapp}
        >
          <FaWhatsapp className={styles.blogShareSmallIcon} />
        </a>
        <a
          className={styles.blogShareLink}
          href={`https://t.me/share/url?url=${shareUrlEncoded}&text=${shareTextEncoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={copy[locale].telegram}
        >
          <RiTelegram2Line />
        </a>
        <a
          className={styles.blogShareLink}
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrlEncoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={copy[locale].linkedin}
        >
          <LiaLinkedinIn />
        </a>
      </div>
    </div>
  );
}
