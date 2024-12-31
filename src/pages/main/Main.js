import React, { useEffect, useState } from "react";
import axios from "axios";

import { Box, Stack, Text, Flex, HStack, useBreakpointValue } from "@chakra-ui/react";

import Maincard from "./MainCard.js";
import Filter from "./filter/Filter";

import { Radio, RadioGroup } from "../../components/ui/radio";
import Swiper from "../../components/swiper/Swiper.js";
import MySpinner from "../../components/Spinner.js";

import { useGeoLocation } from "../../hooks/useGeoLocation";

export default function Main() {
  const [eateries, setEateries] = useState(Array.from({ length: 6 }));
  const [isLoading, setIsLoading] = useState(false);

  const cardWidth = useBreakpointValue({
    base: "100%",   // 모바일: 한 줄에 1개
    sm: "48%",      // 작은 화면: 한 줄에 2개
    md: "30%",      // 중간 화면: 한 줄에 3개
    lg: "22%",      // 큰 화면: 한 줄에 4개
  });

  const loadMoreItems = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setEateries((prev) => [...prev, ...Array.from({ length: 6 })]);
      setIsLoading(false);
    }, 1500); // API 호출 시뮬레이션
  };

  const [value, setValue] = useState("1");

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      loadMoreItems(); // 스크롤 이벤트에서 데이터 로드 호출
    }
  };

  /* GeoLocation : 커스텀 훅 활용 */
  const coords = useGeoLocation();
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (coords) {
      axios("http://localhost:8080/main/address", {
        method: "get",
        params: {
          lat: coords.lat,
          lng: coords.lng,
        },
      })
        .then((response) => response.data)
        .then((data) => setAddress(data))
        .catch((error) => console.error(error));
    }
  }, [coords]);

  return (
    <Stack
      overflowY="auto"
      height="100vh"
      spacing={6}
      margin="0 auto"
      padding="0"
      onScroll={handleScroll} // 스크롤 이벤트 연결
    >
      {/* 전체 레이아웃 */}
      <Stack spacing={6} margin="0 auto">
        {/* 1행: 상단 메뉴 */}
        <Filter></Filter>

        {/* 2행: Swiper */}
        <Box>
          <Swiper />
        </Box>

        {/* 3행: 필터 메뉴 */}
        <Flex justify="space-between" wrap="nowrap" h="40px" p="2" gap={4}>
          <Box borderRadius="md">
            <Text fontSize="lg" fontWeight="bold">
              맛집 BEST
            </Text>
          </Box>

          <Box borderRadius="md">
            <RadioGroup value={value} onValueChange={(e) => setValue(e.value)}>
              <HStack gap="2">
                <Radio value="1" colorPalette="orange">
                  거리순
                </Radio>
                <Radio value="2" colorPalette="orange">
                  별점순
                </Radio>
                <Radio value="3" colorPalette="orange">
                  조회순
                </Radio>
              </HStack>
            </RadioGroup>
          </Box>
        </Flex>

        {/* 4행: 음식점 리스트 */}
        <Flex justify="space-between" wrap="wrap" gap={4} p={"2"}>
          {eateries.map((eatery, index /* List<Eateries>.map */) => (
            <Box key={index} w={cardWidth} borderRadius="md">
              <Maincard
                no={eatery?.no ? eatery.no : (index % 5) + 1}
              ></Maincard>
              {/* 음식점 상세 정보 페이지 <- eateriesNo 전달 */}
            </Box>
          ))}
        </Flex>

        {isLoading && <MySpinner />}
      </Stack>
    </Stack>
  );
}
