import { Box, Flex, Link as ChakraLink } from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHouse, FaUser } from "react-icons/fa6";
import { useSelector } from "react-redux";

// 메뉴 항목 데이터
export const menuItems = [
  { icon: <FaHouse />, label: "메인 화면", path: "/" },
  { icon: <FaUser />, label: "마이페이지", path: "/mypage" },
];

const Footer = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // 로그인 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const location = useLocation(); // 현재 경로 확인을 위한 훅

  // 메뉴 아이템 클릭 시 로그인 상태 체크
  const handleMenuClick = (e, path) => {
    if (path === "/mypage" && !isLoggedIn) {
      e.preventDefault(); // 기본 이동 방지
      navigate("/login"); // 로그인되지 않은 경우 로그인 페이지로 리디렉션
    } else {
      navigate(path); // 다른 경로는 그대로 이동
    }
  };

  return (
    <Flex
      as="footer"
      justify="space-around"
      align="center"
      w="full"
      p={4}
      h="60px"
      bg="white"
      borderTop="2px solid"
      borderColor="gray.200"
      boxShadow="lg"
      position="sticky"
      bottom="0"
      zIndex="1000"
    >
      {menuItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            as={Link}
            to={item.path}
            key={index}
            textDecoration="none"
            _hover={{ color: "orange.500" }}
            onClick={(e) => handleMenuClick(e, item.path)}
            style={{ textDecoration: "none" }}
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              color={isActive ? "orange.600" : "gray.500"}
              _hover={{ color: "orange.600" }}
              transition="color 0.2s"
            >
              <Box fontSize="24px">{item.icon}</Box>
            </Flex>
          </Link>
        );
      })}
    </Flex>
  );
};

export default Footer;
