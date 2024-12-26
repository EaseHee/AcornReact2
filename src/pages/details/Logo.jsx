import React from "react";
import { Image, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import logo from './images/logo.png';

const Logo = () => {
  const navigate = useNavigate();

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