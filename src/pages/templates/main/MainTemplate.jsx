import React from "react";
import { Stack } from "@chakra-ui/react";
import Header from "./Header";
import Body from "./Body";

export default function MainTemplate() {
    return (
        <Stack
            h="100vh"
            w="full"
            maxW="1200px"   // 전체 너비를 1200px로 제한
            margin="0 auto" // 중앙 정렬
            spacing={0}      // 상하 간격 제거
        >
            <Header />
            <Body />
            </Stack>
    );
}