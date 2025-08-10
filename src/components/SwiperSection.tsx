// src/components/TemplateSwiper.tsx
import React from "react";
import styles from "@/scss/Swipper.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { SwiperOptions } from "swiper/types";
import { SITE_VERSION } from "@/config/site";

import "swiper/css";

type Slide = {
  src: string;   // PNG/JPG fallback
  webp?: string; // volitelný WebP
  alt: string;
};

const slides: Slide[] = [
  { webp: "/img/cvtemplate-preview.webp",  src: "/img/cvtemplate-preview.png",  alt: "Šablona 1" },
  { webp: "/img/cvtemplate2-preview.webp", src: "/img/cvtemplate2-preview.png", alt: "Šablona 2" },
  { webp: "/img/cvtemplate3-preview.webp", src: "/img/cvtemplate3-preview.png", alt: "Šablona 3" },
  { webp: "/img/cvtemplate4-preview.webp", src: "/img/cvtemplate4-preview.png", alt: "Šablona 4" },
  { webp: "/img/cvtemplate5-preview.webp", src: "/img/cvtemplate5-preview.png", alt: "Šablona 5" },
  { webp: "/img/cvtemplate6-preview.webp", src: "/img/cvtemplate6-preview.png", alt: "Šablona 6" },
  { webp: "/img/cvtemplate7-preview.webp", src: "/img/cvtemplate7-preview.png", alt: "Šablona 7" },
  { webp: "/img/cvtemplate8-preview.webp", src: "/img/cvtemplate8-preview.png", alt: "Šablona 8" },
];

const visibleSlides = slides.length < 8 ? [...slides, ...slides] : slides;

const swiperParams: SwiperOptions = {
  spaceBetween: 5,
  centeredSlides: true,
  autoplay: { delay: 4500, disableOnInteraction: false },
  // žádné preloadImages / lazy – Swiper v10+ spoléhá na nativní lazy
};

export default function TemplateSwiper() {
  return (
    <Swiper {...swiperParams} modules={[Autoplay]} className={styles.mySwiper}>
      {visibleSlides.map((img, i) => (
        <SwiperSlide key={`${i}-${img.alt}`} className={styles.mySwiperSlide}>
          <picture>
            {img.webp && (
              <source
                srcSet={`${img.webp}?v=${SITE_VERSION}`}
                type="image/webp"
              />
            )}
            <img
              src={`${img.src}?v=${SITE_VERSION}`} // PNG/JPG fallback
              alt={img.alt}
              loading="lazy"
              decoding="async"
              className={styles.mySlideImg}
            />
          </picture>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
