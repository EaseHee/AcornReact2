import React from "react";
import { Route, Routes } from "react-router-dom";
import { Flex, Box } from "@chakra-ui/react";

import Main from "../../main/Main";
import DetailPage from "../../details/DetailPage";
import MyPage from "../../mypage/MyPage";

const Body = () => {
  return (
    <Flex
      direction="row"
      wrap="wrap"
      justify="center"
      bg="gray.50"
      p={4}
      borderRadius="md"
    >
      {/* 메인 콘텐츠 */}
      <Box
        flex={{ base: "1", md: "3" }}
        minW={{ base: "xl", md: "xl" }}
        maxW="1200px"
        bg="white"
        borderRadius="md"
        boxShadow="md"
        p={4}
        margin="0 auto"
      >
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/detail/:no" element={<DetailPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </Box>
    </Flex>
  );
};

export default Body;
