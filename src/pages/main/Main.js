import React, { useState } from "react";
import { Box, Stack, Text, Flex, Button, HStack } from "@chakra-ui/react";
import { Radio, RadioGroup } from "../../components/ui/radio"
import Swiper from "../../components/swiper/Swiper.js";
import Maincard from "./MainCard.js";
import Sidebar from "../sidebar/Sidebar.js";
import MySpinner from "../../components/Spinner.js";
import CategoryDialog from "./CategoryDialog.js";
import LocationDialog from "./LocationDialog.js";
import {Link} from 'react-router-dom';
export default function Main() {
  const [items, setItems] = useState(Array.from({ length: 6 })); // 초기 데이터
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("1")
  // 더 많은 데이터를 로드하는 함수
  const loadMoreItems = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setItems((prev) => [...prev, ...Array.from({ length: 6 })]);
      setIsLoading(false);
    }, 1500); // API 호출 시뮬레이션
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
        loadMoreItems();
    }
};

  return (
    <Flex
    height="100vh"
    width="100vw"
    overflowY="auto"
    onScroll={handleScroll}
    margin="0 auto"
    padding="0"
    >
        {/* 전체 레이아웃 */}
        <Stack spacing={6} maxWidth="65%" margin="0 auto">
        {/* 1행: 상단 메뉴 */}
        <Flex justify="space-between" wrap="wrap">
            <Box h="8vh" w="23%" borderRadius="md" p={4}>
                <Text>로고</Text>
            </Box>
            <Box h="8vh" w="23%" borderRadius="md" p={4}>
                <CategoryDialog></CategoryDialog>
            </Box>
            <Box h="8vh" w="23%" borderRadius="md" p={4}>
                <LocationDialog></LocationDialog>
            </Box>
            <Box h="8vh" w="23%" borderRadius="md" py={4} display="flex" justifyContent="flex-end"alignItems="flex-end">
                <Button as={Link} to="/login">로그인</Button>
            </Box>
        </Flex>

        {/* 2행: Swiper */}
        <Box>
            <Swiper />
        </Box>

        {/* 3행: 필터 메뉴 */}
        <Flex justify="space-between" wrap="wrap" gap={4}>
            <Box h="5vh" w="23%" borderRadius="md" p={2}>
            <Text>음식점 목록</Text>
            </Box>

            <Box h="5vh" w="33%" borderRadius="md" p={2}>
            <RadioGroup value={value} onValueChange={(e) => setValue(e.value)}>
                <HStack gap="2">
                    <Radio value="1">거리순</Radio>
                    <Radio value="2">별점순</Radio>
                    <Radio value="3">조회순</Radio>
                </HStack>
            </RadioGroup>
            </Box>
        </Flex>

        {/* 4행: 음식점 리스트 */}
        <Flex justify="space-between" wrap="wrap" gap={4}>
            {items.map((_, index) => (
                <Box
                key={index}
                h="50vh"
                w="30%"
                borderRadius="md"
                >
                <Maincard></Maincard>
            </Box>
            ))}
            {isLoading && <MySpinner alignSelf="center" />}
        </Flex>
        </Stack>
        <Sidebar></Sidebar>
    </Flex>
  );
}
