import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay'; // Import the autoplay CSS

// Import required modules directly from 'swiper'
import { Pagination, Navigation, Autoplay } from 'swiper';
import images from '~/assets/images/index';

// Custom slider data with images and titles
const sliders = [
    {
        img: images.adidasBanner,
        title: 'Adidas',
    },
    {
        img: images.nikeBanner,
        title: 'Nike',
    },
];

export default function Slider() {
    return (
        <>
            <Swiper
                style={{ height: '500px', width: '1284px' }}
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                autoplay={{
                    delay: 3000, // Delay between slides in milliseconds (3000ms = 3 seconds)
                    disableOnInteraction: false, // Autoplay won't stop after user interaction
                }}
                modules={[Pagination, Navigation, Autoplay]} // Add Autoplay module
                className="mySwiper"
            >
                {sliders.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <img
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            src={slide.img}
                            alt={slide.title}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}
