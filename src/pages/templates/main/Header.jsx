import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import axios from "utils/axios";

import { useTheme } from "next-themes";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";

import { menuItems } from "../../sidebar/Sidebar";
import { logout } from "../../../redux/slices/authSlice";
import Logo from "../../../components/Logo";
import {useColorMode, useColorModeValue} from "../../../components/ui/color-mode";

const Header = () => {
  // 사용자의 로그인 상태를 redux에 저장하여 useSelector와 useDispatch 훅을 이용해서 전역적으로 관리
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            const response = await axios.post("/auth/logout");
            if (response.status === 200) {
                dispatch(logout()); // 로그아웃
            }
        } catch (error) {
            console.error("로그아웃 에러 : ", error);
            alert("로그아웃 에러");
        }
    };

  // 상세 페이지로 이동 시 active 속성을 제거하기 위해 useLocation 훅을 이용
  const location = useLocation();

  const renderMenuItems = () => {
    return menuItems.map((item, index) => {
      // 현재 경로와 메뉴의 경로가 다를 경우 active 해제
      const isActive = location.pathname === item.path;
      return (
        // JSX 반환
        <Link to={item.path} key={index} style={{ textDecoration: "none" }}>
          <Flex
            direction="column"
            align="center"
            justify="center"
            gap={2}
            color={isActive ? "blue.600" : "gray.500"}
            _hover={{ color: "blue.600" }}
          >
            <Box as="span">{item.icon}</Box>
            <Text fontSize="sm" fontWeight={600} textAlign="center">
              {item.label}
            </Text>
          </Flex>
        </Link>
      );
    });
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      p={4}
      w="full"
      maxW="1200px" // 헤더 너비를 1200px로 제한
      margin="0 auto" // 중앙 정렬
      h="60px"
      bg="white"
      boxShadow="lg" // 좀 더 깊은 그림자 추가
      position="sticky" // 헤더 고정
      top="0" // 상단 고정
      zIndex="10" // 다른 요소들 위로
      borderBottom="2px solid" // 아래쪽에 경계선 추가
      borderColor="gray.200" // 경계선 색상 설정
      borderRadius="md" // 둥근 모서리 추가
    >
      {/* 로고 */}
      <Box>
        <Logo />
      </Box>

      {/* 메뉴 */}
      <HStack
        as="nav"
        spacing={8}
        flexWrap="nowrap"
        justify="space-between"
      >
        {renderMenuItems()}
      </HStack>

      {/* 로그인/로그아웃 버튼 + 테마 토글 */}
      <Flex align="center" gap={4}>
        {isLoggedIn ? (
          <Button
            onClick={handleLogout}
            size="sm"
            variant="outline"
            colorScheme="red" // 로그아웃 버튼에 빨간색 테마 적용
            _hover={{ bg: "red.500", color: "white" }} // hover 시 색상 변경
          >
            로그아웃
          </Button>
        ) : (
          <Button
            as={Link}
            to="/login"
            size="sm"
            variant="solid"
            colorPalette="orange" // 로그인 버튼에 파란색 테마 적용
            _hover={{ bg: "orange.500", color: "white" }} // hover 시 색상 변경
          >
            로그인
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
