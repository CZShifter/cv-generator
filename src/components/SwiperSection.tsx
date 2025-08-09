import styles from '@/scss/Swipper.module.scss'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'

const slides = [
  { src: "/img/cvtemplate-preview.png", alt: "Šablona 1" },
  { src: "/img/cvtemplate2-preview.png", alt: "Šablona 2" },
  { src: "/img/cvtemplate3-preview.png", alt: "Šablona 3" },
  { src: "/img/cvtemplate4-preview.png", alt: "Šablona 4" },
  { src: "/img/cvtemplate5-preview.png", alt: "Šablona 5" },
  { src: "/img/cvtemplate6-preview.png", alt: "Šablona 6" },
  { src: "/img/cvtemplate7-preview.png", alt: "Šablona 7" },
  { src: "/img/cvtemplate8-preview.png", alt: "Šablona 8" }
];
const visibleSlides = slides.length < 8 ? [...slides, ...slides] : slides

export default function App() {
  return (
    <Swiper
      spaceBetween={5}
      centeredSlides={true}
      autoplay={{
        delay: 4500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={false}
      modules={[Autoplay]}
      className={styles.mySwiper}
    >
      {visibleSlides.map((img, i) => (
        <SwiperSlide key={i + img.alt} className={styles.mySwiperSlide}>
          <img
            src={img.src}
            alt={img.alt}
            loading="lazy"
          />
          <div className="swiper-lazy-preloader"></div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
