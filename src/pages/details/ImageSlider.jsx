import React, { useEffect, useRef, useState } from "react";
import { Box, Image } from "@chakra-ui/react";
import fetchRestaurantImages from "./RestaurantApi";
import MySpinner from "../../components/Spinner"; // 카카오 API 이미지 호출 함수

const ImageSlider = ({ restaurant }) => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  // 이미지 슬라이드용 타이머
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // 이미지가 있을 때만 타이머 설정
    if (images.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((index) => (index === images.length - 1 ? 0 : index + 1));
      }, 3000);
    }
  };

  // 이전 슬라이드
  const handlePrevious = () => {
    setCurrentIndex((index) => (index === 0 ? images.length - 1 : index - 1));
    resetTimer();
  };

  // 다음 슬라이드
  const handleNext = () => {
    setCurrentIndex((index) => (index === images.length - 1 ? 0 : index + 1));
    resetTimer();
  };

  // 음식점 이미지를 가져오는 로직
  useEffect(() => {
    const fetchImages = async () => {
      if (restaurant?.name && restaurant?.address) {
        try {
          const fetchedImages = await fetchRestaurantImages(
              restaurant.name,
              restaurant.address // 주소 추가
          );
          setImages(fetchedImages);
        } catch (error) {
          console.error("이미지 fetch 에러:", error);
        }
      }
    };

    fetchImages();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [restaurant]);

  // 이미지가 로드되면 타이머 시작
  useEffect(() => {
    if (images.length > 0) {
      resetTimer();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [images]);

  // 이미지 로딩 처리 (by @EaseHee)
  if (images.length === 0) {
    return <Box h="400px"><MySpinner/></Box>;
  }

  return (
      <Box position="relative" width="100%" mb={4}>
        {/* 슬라이더 */}
        <Box overflow="hidden" borderRadius="md" height="400px">
          <Box
              display="flex"
              transform={`translateX(-${currentIndex * 100}%)`}
              transition="transform 0.5s ease-in-out"
          >
            {images.map((image, index) => (
                <Image
                    key={index}
                    src={image}
                    alt={`Slide ${index + 1}`}
                    objectFit="cover"
                    minWidth="100%"
                    height="400px"
                />
            ))}
          </Box>
        </Box>

        {/* 이전 버튼 */}
        <Box
            as="button"
            position="absolute"
            left={4}
            top="50%"
            transform="translateY(-50%)"
            onClick={handlePrevious}
            bg="blackAlpha.700"
            _hover={{ bg: "blackAlpha.800", cursor: "pointer" }}
            _active={{ bg: "blackAlpha.900" }}
            color="white"
            borderRadius="md"
            px={4}
            py={2}
            fontSize="24px"
            fontWeight="bold"
            zIndex={10}
        >
          {"<"}
        </Box>

        {/* 다음 버튼 */}
        <Box
            as="button"
            position="absolute"
            right={4}
            top="50%"
            transform="translateY(-50%)"
            onClick={handleNext}
            bg="blackAlpha.700"
            _hover={{ bg: "blackAlpha.800", cursor: "pointer" }}
            _active={{ bg: "blackAlpha.900" }}
            color="white"
            borderRadius="md"
            px={4}
            py={2}
            fontSize="24px"
            fontWeight="bold"
            zIndex={10}
        >
          {">"}
        </Box>

        {/* 슬라이드 점 표시 */}
        <Box
            position="absolute"
            bottom={4}
            left="50%"
            transform="translateX(-50%)"
            display="flex"
            gap={2}
        >
          {images.map((_, index) => (
              <Box
                  key={index}
                  width={3}
                  height={3}
                  borderRadius="full"
                  bg={currentIndex === index ? "white" : "whiteAlpha.600"}
                  cursor="pointer"
                  onClick={() => {
                    setCurrentIndex(index);
                    resetTimer();
                  }}
              />
          ))}
        </Box>
      </Box>
  );
};

export default ImageSlider;