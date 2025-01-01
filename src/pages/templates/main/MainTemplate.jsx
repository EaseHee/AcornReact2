import React from "react";
import { Stack } from "@chakra-ui/react";
import Header from "./Header";
import Body from "./Body";

export default function MainTemplate() {
    return (
            <Stack h="98vh">
            <Header />
            <Body />
            </Stack>
    );
}