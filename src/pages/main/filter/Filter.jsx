import React from "react";

import {Box, Flex, Text} from "@chakra-ui/react";

import CategoryDialog from "./CategoryDialog";
import LocationDialog from "./LocationDialog";

const Filter = () => {
    return (
        <Flex wrap="wrap" >
            <Box borderRadius="md" >
                <CategoryDialog></CategoryDialog>
            </Box>
            <Box borderRadius="md" >
                <LocationDialog></LocationDialog>
            </Box>
        </Flex>
    );
}

export default Filter;