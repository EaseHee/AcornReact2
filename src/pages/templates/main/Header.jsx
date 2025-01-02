import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaSun, FaMoon } from "react-icons/fa6"; // 다크/라이트 모드 아이콘

import axios from "utils/axios";

import { useTheme } from "next-themes";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";

import { menuItems } from "../../sidebar/Sidebar";
import { logout } from "../../../redux/slices/authSlice";
import Logo from "../../../components/Logo";
import { useEffect, useState } from "react";

const Header = () => {
  // 사용자의 로그인 상태를 redux에 저장하여 useSelector와 useDispatch 훅을 이용해서 전역적으로 관리
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const response = await axios.get(
          "/main/mypage/members/read",
          {
            withCredentials: true,
          }
        );
        setNickname(response.data.nickname);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (isLoggedIn) {
      fetchNickname(); // 로그인 상태일 때 닉네임 가져오기
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      const response = await axios.post("/auth/logout");
      if (response.status === 200) {
        alert("로그아웃 성공");
        dispatch(logout()); // 로그아웃
        navigate("/login");
      }
    } catch (error) {
      console.error("로그아웃 에러 : ", error);
      alert("로그아웃 에러");
    }
  };

  // 테마 변경을 위해 useTheme 훅을 이용하여 토글로 변경
  const { theme, setTheme } = useTheme(); // 현재 테마와 테마 변경 함수
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  const themeIcon = theme === "dark" ? <FaSun /> : <FaMoon />;

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
      maxW="1200px"
      margin="0 auto"
      h="60px"
      bg="white"
      boxShadow="lg"
      position="sticky"
      top="0"
      zIndex="1000"
      borderBottom="2px solid"
      borderColor="gray.200"
      borderRadius="md"
    >
      {/* 로고 */}
      <Box>
        <Logo />
      </Box>

      {/* 메뉴 */}
      <HStack
        as="nav"
        spacing={8}
        display={{ base: "flex", md: "none" }}
        flexWrap="nowrap"
        justify="space-between"
      >
        {renderMenuItems()}
      </HStack>

      {/* 로그인/로그아웃 버튼 + 닉네임 + 테마 토글 */}
      <Flex align="center" gap={4}>
        {isLoggedIn ? (
          <>
            {/* 닉네임 */}
            {!loading && !error && (
              <Text fontSize="lg" fontWeight="bold">
                {nickname}
              </Text>
            )}
            <Button
              onClick={handleLogout}
              size="sm"
              variant="solid"
              colorPalette="orange"
              _hover={{ bg: "orange.500", color: "white" }}
            >
              로그아웃
            </Button>
          </>
        ) : (
          <Button
            as={Link}
            to="/login"
            size="sm"
            variant="solid"
            colorPalette="orange"
            _hover={{ bg: "orange.500", color: "white" }}
          >
            로그인
          </Button>
        )}
        {/* 다크모드/라이트모드 토글 */}
        <Box
          as={themeIcon.type}
          fontSize="24px"
          cursor="pointer"
          onClick={toggleTheme}
          _hover={{ color: "yellow.600" }}
        />
      </Flex>
    </Flex>
  );
};

export default Header;
