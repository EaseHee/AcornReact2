import React, { useEffect, useRef, useState } from "react";
import { Box, Image } from "@chakra-ui/react";

import image1 from "./images/1.jpg";
import image2 from "./images/2.png";
import image3 from "./images/3.png";
import image4 from "./images/4.jpg";
import image5 from "./images/5.jpg";

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [image1, image2, image3, image4, image5];
  const timerRef = useRef(null);

  // 자동 슬라이더
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCurrentIndex((index) => (index === images.length - 1 ? 0 : index + 1));
    }, 3000);
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

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, []);

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
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ImageSlider;
