import React from "react";
import { Stack } from "@chakra-ui/react";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

export default function MainTemplate() {
    return (
        <Stack
            h="100vh"
            w="full"
            maxW="1200px"
            margin="0 auto"
            spacing={0}
        >
            <Header />
            <Body />
            <Footer />
        </Stack>
    );
}