import React, { useEffect, useRef, useState } from "react";

interface ReloadableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

const ReloadableImage: React.FC<ReloadableImageProps> = ({ src, ...imgProps }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const lastBlobUrl = useRef<string | null>(null);

  useEffect(() => {
    // data: a blob: nech tak, jak je
    if (src.startsWith("data:") || src.startsWith("blob:")) {
      setCurrentSrc(src);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(src, { cache: "reload" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }

        // uklid starého blobu
        if (lastBlobUrl.current) URL.revokeObjectURL(lastBlobUrl.current);
        lastBlobUrl.current = url;
        setCurrentSrc(url);
      } catch {
        if (!cancelled) setCurrentSrc(src); // fallback na původní URL
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [src]);

  // finální úklid při unmountu
  useEffect(() => {
    return () => {
      if (lastBlobUrl.current) URL.revokeObjectURL(lastBlobUrl.current);
    };
  }, []);

  return <img src={currentSrc} {...imgProps} />;
};

export default ReloadableImage;
