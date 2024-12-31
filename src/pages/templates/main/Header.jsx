import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaSun, FaMoon } from "react-icons/fa6"; // 다크/라이트 모드 아이콘

import axios from "utils/axios";

import { useTheme } from "next-themes";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";

import { menuItems } from "../../sidebar/Sidebar";
import { logout } from "../../../redux/slices/authSlice";
import Logo from "../../../components/Logo";

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
            return ( // JSX 반환
                <Link
                    to={item.path}
                    key={index}
                    style={{ textDecoration: "none" }}
                >
                    <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        gap={2}
                        color={isActive ? "blue.600" : "gray.500"}
                        _hover={{ color: "blue.600" }}
                    >
                        <Box as="span">{item.icon}</Box>
                        <Text
                            fontSize="sm"
                            fontWeight={600}
                            textAlign="center"
                        >
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
            wrap="nowrap"
            p={2}
            w="100%"
            h="50px"
            position="sticky"
            top="0"
            bg="white"
            zIndex="20"
            boxShadow="sm"
        >
            <Box borderRadius="md">
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

            {/* 오른쪽: 로그인/로그아웃 버튼 + 다크/라이트 모드 토글 */}
            <Flex align="center" gap={4}>
                {isLoggedIn ? (
                    <Button onClick={handleLogout}>로그아웃</Button>
                ) : (
                    <Button as={Link} to="/login">로그인</Button>
                )}
                <Box
                    as={themeIcon.type}
                    fontSize="24px"
                    cursor="pointer"
                    onClick={toggleTheme}
                />
            </Flex>
        </Flex>
    );
};

export default Header;