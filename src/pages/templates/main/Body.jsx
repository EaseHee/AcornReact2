import React from "react";
import { Route, Routes } from "react-router-dom";
import { Flex, Box } from "@chakra-ui/react";

import Main from "../../main/Main";
import Sidebar from "../../sidebar/Sidebar";
import DetailPage from "../../details/DetailPage";
import MyPage from "../../mypage/MyPage";

const Body = () => {
    return (
        <Flex direction="row">
            {/* 좌측 여백 (md 이하에서는 숨김) */}
            <Box
                display={{ base: "none", md: "block" }} // md 이상에서만 표시
                flex={{ base: "0", md: "1" }} // md 이하에서는 숨김
            ></Box>

            {/* 메인 콘텐츠 */}
            <Box
                flex={{ base: "1", md: "3" }} // md 이상에서 화면을 가득 채움
                minW={{ base: "xl", md: "xl" }} // 반응형 너비 설정
                maxW={"xl"}
                bg="white"
                margin="0 auto"
            >
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/detail/:no" element={<DetailPage />} />
                    <Route path="/mypage" element={<MyPage />} />
                </Routes>
            </Box>

            {/* 우측 Sidebar (md 이하에서는 숨김) */}
            <Box
                display={{ base: "none", md: "block" }} // md 이상에서만 표시
                flex={{ base: "0", md: "1" }} // md 이하에서는 숨김
            >
                <Sidebar />
            </Box>
        </Flex>
    );
};

export default Body;