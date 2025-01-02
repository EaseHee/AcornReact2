// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './mainswiper.css';
// Import required modules
import { Mousewheel, Pagination, Autoplay } from 'swiper/modules';
import {Box, Heading, Image, Text} from "@chakra-ui/react";
export default function MainSwiper() {

    const banners = [
        {
            no: 1,
            thumbnail: "/banner01.png",
        },
        {
            no: 2,
            thumbnail: "/banner02.png",
        },
        {
          no: 3,
          thumbnail: "/banner03.png",
        },
    ];

    return (
    <div className="swiper-container">
      <Swiper
        modules={[Mousewheel, Pagination, Autoplay]} // 사용할 모듈 설정
        pagination={{ clickable: true }} // 페이지네이션 활성화
        spaceBetween={50} // 슬라이드 간 간격
        slidesPerView={1} // 한 번에 보여줄 슬라이드 개수
        speed={500} // 전환 속도
        mousewheel={true}
        direction={'horizontal'}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
      >
        {banners.map((banner) => (
            <SwiperSlide key={banner.no}>
                <img
                    className="slide-image"
                    src={banner.thumbnail}
                    borderRadius="md"
                    boxShadow="sm"
                />
            </SwiperSlide>
        ))}
      </Swiper>
    </div>
    );
  }