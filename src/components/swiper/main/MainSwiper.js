// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./mainswiper.css";
// Import required modules
import { Mousewheel, Pagination, Autoplay } from "swiper/modules";
import { Box, Heading, Image, Text } from "@chakra-ui/react";
export default function MainSwiper() {
  const banners = [
    { no: 1, thumbnail: "/banner01.png" },
    { no: 2, thumbnail: "/banner02.png" },
    { no: 3, thumbnail: "/banner03.png" },
  ];

  return (
    <Box w="100%" h="fit-content" className="swiper-container">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
        }}
        spaceBetween={0}
        slidesPerView={1}
        speed={500}
        mousewheel={true}
        direction={"horizontal"}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.no}>
            <Box
              as="img"
              src={banner.thumbnail}
              alt={`Banner ${banner.no}`}
              w="100%"
              h="100%"
              objectFit="cover" // 이미지가 컨테이너를 가득 채우도록 설정
            />
          </SwiperSlide>
        ))}
        <Box className="swiper-pagination" mt="2" /> {/* 페이지네이션 요소 */}
      </Swiper>
    </Box>
  );
}
