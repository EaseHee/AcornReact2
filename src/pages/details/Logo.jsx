import React from "react";
import { Image, Box } from "@chakra-ui/react";
import logo from './images/logo.png';  // import로 변경

const Logo = () => {
  return (
    <Box mb={4}>
      <Image src={logo} alt="Logo" maxH="50px" mx="left" />
    </Box>
  );
};

export default Logo;