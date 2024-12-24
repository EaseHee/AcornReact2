import React from "react";
import { Image, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import logo from './images/logo.png';

const Logo = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 네비게이터 객체 생성

  const handleLogoClick = () => {
    navigate("/"); // 메인 페이지로 이동
  };

  return (
    <Box mb={4}>
      <Image 
        src={logo} 
        alt="Logo" 
        maxH="50px" 
        mx="left" 
        cursor="pointer" 
        onClick={handleLogoClick}
      />
    </Box>
  );
};

export default Logo;