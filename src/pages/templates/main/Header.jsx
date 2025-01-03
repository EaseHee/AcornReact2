import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import axios from "utils/axios";

import { useTheme } from "next-themes";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";

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
        //alert("로그아웃 성공");
        dispatch(logout()); // 로그아웃
        navigate("/login");
      }
    } catch (error) {
      console.error("로그아웃 에러 : ", error);
      //alert("로그아웃 에러");
    }
  };

  // 상세 페이지로 이동 시 active 속성을 제거하기 위해 useLocation 훅을 이용
  const location = useLocation();

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
      zIndex="900"
      borderBottom="2px solid"
      borderColor="gray.200"
      borderRadius="md"
    >
      {/* 로고 */}
      <Box>
        <Logo />
      </Box>

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
      </Flex>
    </Flex>
  );
};

export default Header;
