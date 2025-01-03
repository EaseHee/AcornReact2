import React from "react";

import {Box, Flex} from "@chakra-ui/react";

import CategoryDialog from "./CategoryDialog";
import LocationDialog from "./LocationDialog";


const Filter = () => {
    return (
        <Flex wrap="wrap" pb={3} >
            <Box borderRadius="md">
                <CategoryDialog/>
            </Box>
            <Box borderRadius="md" >
                <LocationDialog/>
            </Box>
        </Flex>
    );
}

export default Filter;