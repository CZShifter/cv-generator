import React, { useEffect, useState } from "react";

interface ReloadableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

const ReloadableImage: React.FC<ReloadableImageProps> = ({ src, ...imgProps }) => {
  const [blobUrl, setBlobUrl] = useState(src);

  useEffect(() => {
    // Pokud jde o data-URI, nic neposílat na server
    if (src.startsWith("data:")) {
      setBlobUrl(src);
      return;
    }

    let active = true;
    // Vynutíme fetch mimo cache
    fetch(src, { cache: "reload" })
      .then((res) => res.blob())
      .then((blob) => {
        if (!active) return;
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      })
      .catch(() => {
        // Kdyby fetch selhal, zachováme původní src
        if (active) setBlobUrl(src);
      });
    return () => {
      active = false;
      // Uvolníme blob URL, až se komponenta odmountuje / src se změní
      if (blobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [src]);

  return <img src={blobUrl} {...imgProps} />;
};

export default ReloadableImage;
