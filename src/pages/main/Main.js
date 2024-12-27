import React, { useEffect, useMemo, useState } from "react";
import { Box, Stack, Text, Flex, Button, HStack } from "@chakra-ui/react";
import { Radio, RadioGroup } from "../../components/ui/radio";
import Swiper from "../../components/swiper/Swiper.js";
import Maincard from "./MainCard.js";
import Sidebar from "../sidebar/Sidebar.js";
import MySpinner from "../../components/Spinner.js";
import CategoryDialog from "./CategoryDialog.js";
import LocationDialog from "./LocationDialog.js";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios";

export default function Main({ isLoggedIn, setIsLoggedIn }) {
  const [items, setItems] = useState(Array.from({ length: 6 })); // 초기 데이터
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("1");
  const navigate = useNavigate();
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

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:8080/auth/logout", {
        withCredentials: true,
      });
      if (response.status === 200) {
        alert("로그아웃 성공");
        setIsLoggedIn(false); // 로그인 상태를 false로 변경
        window.location.href = '/login'; // 로그인 페이지로 리디렉션
      }
    } catch (error) {
      console.error("로그아웃 에러 : ", error);
      alert("로그아웃 에러");
    }
  };

  /* GeoLocation */
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const successCallback = (position) => {
      setCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      console.log(
        "위치 불러오기 성공",
        position.coords.latitude,
        position.coords.longitude
      );
    };

    const errorCallback = () => {
      setCoords({
        lat: 37.498863932227,
        lng: 127.03167064582,
      });
      console.log("위치 불러오기 실패");
    };
    const options = {
      // 현재 위치 세부 조정
      enableHighAccuracy: true,
      timeout: 5 * 1000, // 데이터 반환까지 최대 대기 시간 (현재 5초). 이후 errorCallback 호출 "default : Infinity"
      maximumAge: 60 * 1000, // 캐시 데이터 사용 시간 (현재 1분) "default : 0 -> 항상 최신 위치 요청"
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback,
        options
      );
    }
  }, []);

  useEffect(() => {
    if (coords) {
      axios("http://localhost:8080/main/address", {
        method: "get",
        params: {
          lat: coords.lat,
          lng: coords.lng,
        },
      })
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          setAddress(data);
          console.log("data : ", data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [coords]);

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
          <Box
            h="8vh"
            w="23%"
            borderRadius="md"
            py={4}
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            {isLoggedIn ? (
              <Button onClick={handleLogout}>로그아웃</Button>
            ) : (
              <Button as={Link} to="/login">
                로그인
              </Button>
            )}
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
          {items.map((_, index /* List<Eateries>.map */) => (
            <Box key={index} h="50vh" w="30%" borderRadius="md">
              <Maincard no={(index % 5) + 1}></Maincard>
              {/* 음식점 상세 정보 페이지 <- eateriesNo 전달 */}
            </Box>
          ))}
          {isLoading && <MySpinner alignSelf="center" />}
        </Flex>
      </Stack>
      <Sidebar></Sidebar>
    </Flex>
  );
}
