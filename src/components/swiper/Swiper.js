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

    const eateries = [
        {
            no: 1,
            name: "상호명 1",
            thumbnail: "https://search2.kakaocdn.net/argon/130x130_85_c/6e20F7GJbB8",
            category: {
                name: "카테고리 1"
            }
        },
        {
            no: 2,
            name: "상호명 2",
            thumbnail: "https://search3.kakaocdn.net/argon/130x130_85_c/Kv5dW1vQJKP",
            category: {
                name: "카테고리 2"
            }
        }
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
        direction={'vertical'}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
      >
        {eateries.map((eatery) => (
            <SwiperSlide key={eatery.no}>
              <Box
                  className="swiper-slide-content"
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  p={2}
                  bg="gray.50"
                  borderRadius="md"
                  boxShadow="md"
              >
                <Box className="text-container" textAlign="center" mb={4}>
                  <Heading as="h1" size="md" mb={2}>
                    {eatery.name}
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    {eatery.category.name}
                  </Text>
                </Box>
                <Image
                    className="slide-image"
                    alt={`${eatery.name} 사진`}
                    src={eatery.thumbnail}
                    borderRadius="md"
                    boxShadow="sm"
                />
              </Box>
            </SwiperSlide>
        ))}
      </Swiper>
    </div>
    );
  }