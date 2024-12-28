import {
  Box,
  Button,
  createListCollection,
  HStack,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Text,
  Textarea,
} from '@chakra-ui/react';
// import { BsStar, BsStarFill } from 'react-icons/bs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function CreateReview() {
  const frameworks = createListCollection({
    items: [
      { label: '★★★★★', value: 5 },
      { label: '★★★★☆', value: 4 },
      { label: '★★★☆☆', value: 3 },
      { label: '★★☆☆☆', value: 2 },
      { label: '★☆☆☆☆', value: 1 },
    ],
  });
  
  return (
    <Box>
      <HStack>
        <Text whiteSpace="nowrap">별점 선택:</Text>
        <SelectRoot collection={frameworks} size="sm" ml="1">
          <SelectTrigger>
            <SelectValueText placeholder="당신의 점수는?" />
          </SelectTrigger>
          <SelectContent>
            {frameworks.items.map((movie) => (
              <SelectItem item={movie} key={movie.value}>
                {movie.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      </HStack>
      이미지 첨부:<Button ml="2">올리기...</Button>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={15}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        style={{ width: '100%', height: '300px' }}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        loop="true"
      >
        <SwiperSlide>
          <Box bg="gray.200" height="100%" display="flex" alignItems="center" justifyContent="center">
            Slide 1
          </Box>
        </SwiperSlide>
        <SwiperSlide>
          <Box bg="gray.300" height="100%" display="flex" alignItems="center" justifyContent="center">
            Slide 2
          </Box>
        </SwiperSlide>
        <SwiperSlide>
          <Box bg="gray.400" height="100%" display="flex" alignItems="center" justifyContent="center">
            Slide 3
          </Box>
        </SwiperSlide>
        <SwiperSlide>
          <Box bg="gray.500" height="100%" display="flex" alignItems="center" justifyContent="center">
            Slide 4
          </Box>
        </SwiperSlide>
      </Swiper>
      <Box textAlign="center">
        <Button>이미지 비우기</Button>
      </Box>
      <Textarea></Textarea>
    </Box>
  );
}
