import React from "react";

import {Box, Button, Flex} from "@chakra-ui/react";

import CategoryDialog from "./CategoryDialog";
import LocationDialog from "./LocationDialog";


const Filter = ({applyFilters}) => {
    return (
        <Flex wrap="wrap" >
            <Box borderRadius="md">
                <CategoryDialog/>
            </Box>
            <Box borderRadius="md" >
                <LocationDialog/>
            </Box>
            <Button ml={"10px"} colorPalette="orange" onClick={applyFilters}>적용</Button>
        </Flex>
    );
}

export default Filter;