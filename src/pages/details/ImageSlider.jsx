import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton, Image } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // npm install lucide-react@0.263.1

import image1 from './images/1.jpg';  // 첫 번째 이미지
import image2 from './images/2.png';  // 두 번째 이미지
import image3 from './images/3.png';  // 세 번째 이미지
import image4 from './images/4.jpg';  // 네 번째 이미지
import image5 from './images/5.jpg';  // 다섯 번째 이미지

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);  // 슬라이드의 현재 인덱스를 관리하는 상태 변수 (초기값 0)
  const images = [image1, image2, image3, image4, image5];
  const timerRef = useRef(null); // 타이머 ID를 저장할 ref, 리렌더링시 값을 잃지 않으며 컴포넌트가 언마운트될 때까지 값 유지

  // 슬라이더 타이머 조절 함수
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current); // 기존 타이머 초기화
    }
    timerRef.current = setInterval(() => {
      setCurrentIndex((index) => (index === images.length - 1 ? 0 : index + 1));
    }, 3000); // 3초마다 자동으로 슬라이드를 전환하는 타이머 설정
  };

  // 이전 이미지로 이동하는 함수
  const handlePrevious = () => {
    setCurrentIndex((index) => (index === 0 ? images.length - 1 : index - 1)); // 현재 인덱스가 0이면 마지막 이미지로, 아니면 한 칸 뒤로 이동
    resetTimer(); // 타이머 초기화 및 재설정
  };

  // 다음 이미지로 이동하는 함수
  const handleNext = () => {
    setCurrentIndex((index) => (index === images.length - 1 ? 0 : index + 1)); // 현재 인덱스가 마지막이면 첫 번째 이미지로, 아니면 한 칸 앞으로 이동
    resetTimer(); // 타이머 초기화 및 재설정
  };

  useEffect(() => {
    resetTimer(); // 컴포넌트 마운트 시 타이머 설정
    return () => clearInterval(timerRef.current); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  return (
    <Box position="relative" mb={4}>
      <Box
        overflow="hidden"  // 이미지가 Box를 벗어나지 않도록 숨깁니다.
        borderRadius="md"  // 모서리를 둥글게 설정
        height="400px"  // 슬라이더의 높이를 설정
        position="relative"  // 위치를 상대적으로 설정
      >
        <Box
          display="flex"  // 이미지를 가로로 나열하기 위해 flex 사용
          transform={`translateX(-${currentIndex * 100}%)`}  // 슬라이드 이동 (현재 인덱스에 따라 x축으로 이동)
          transition="transform 0.3s ease-in-out"  // 이동 시 부드럽게 전환되는 효과를 줍니다.
        >
          {images.map((image, index) => (  // images 배열의 각 이미지에 대해 반복
            <Image
              key={index}  // 각 이미지의 고유 key를 설정
              src={image}  // 이미지 경로
              alt={`Slide ${index + 1}`}  // 이미지 설명 (슬라이드 번호)
              objectFit="cover"  // 이미지가 박스를 채우도록 비율에 맞춰 크기 조절
              minWidth="100%"  // 각 이미지를 슬라이드 영역의 너비로 설정
              height="400px"  // 이미지의 높이를 설정
            />
          ))}
        </Box>
      </Box>
      
      {/* 이전 버튼 수정 */}
      <IconButton
        icon={<ChevronLeft size={24} />}
        aria-label="Previous"
        position="absolute"
        left={4}
        top="50%"
        transform="translateY(-50%)"
        onClick={handlePrevious}
        bg="rgba(0, 0, 0, 0.2)" // 기본 반투명 배경
        _hover={{ bg: "rgba(0, 0, 0, 0.4)" }} // 호버 시 더 어두운 배경
        _active={{ bg: "rgba(0, 0, 0, 0.6)" }} // 클릭 시 더욱 어두운 배경
        _focus={{ boxShadow: "none" }} // 포커스 시 박스 그림자 제거
        color="white" // 아이콘 색상을 흰색으로 설정
        p={2} // 내부 여백
        transition="background-color 0.2s ease" // 부드러운 전환 효과 추가
      />
      
      {/* 다음 버튼 수정 */}
      <IconButton
        icon={<ChevronRight size={24} />}
        aria-label="Next"
        position="absolute"
        right={4}
        top="50%"
        transform="translateY(-50%)"
        onClick={handleNext}
        bg="rgba(0, 0, 0, 0.2)" // 기본 반투명 배경
        _hover={{ bg: "rgba(0, 0, 0, 0.4)" }} // 호버 시 더 어두운 배경
        _active={{ bg: "rgba(0, 0, 0, 0.6)" }} // 클릭 시 더욱 어두운 배경
        _focus={{ boxShadow: "none" }} // 포커스 시 박스 그림자 제거
        color="white" // 아이콘 색상을 흰색으로 설정
        p={2} // 내부 여백
        transition="background-color 0.2s ease" // 부드러운 전환 효과 추가
      />

      {/* 슬라이드 하단의 점 표시 */}
      <Box 
        position="absolute" 
        bottom={4}  // 하단 4만큼 여백을 줍니다.
        left="50%"  // 수평 중앙 정렬
        transform="translateX(-50%)"  // 정확히 중앙에 맞추기 위해 translate
        display="flex"  // 점들을 가로로 배치
        gap={2}  // 점들 간의 간격을 2로 설정
      >
        {images.map((_, index) => (  // images 배열의 길이만큼 점을 만듭니다.
          <Box
            key={index}  // 각 점의 고유 key 설정
            width={2}  // 점의 크기 (너비)
            height={2}  // 점의 크기 (높이)
            borderRadius="full"  // 원형으로 설정
            bg={currentIndex === index ? "white" : "whiteAlpha.600"}  // 현재 슬라이드와 일치하는 점은 하얀색, 아니면 반투명한 하얀색
            cursor="pointer"  // 점 클릭 시 커서가 손 모양으로 바뀌도록 설정
            onClick={() => setCurrentIndex(index)}  // 점 클릭 시 해당 인덱스로 슬라이드를 이동
          />
        ))}
      </Box>
    </Box>
  );
};

export default ImageSlider; 
