import {Box, Flex} from "@chakra-ui/react";

import CategoryDialog from "./CategoryDialog";
import LocationDialog from "./LocationDialog";
import RecommendButton from "./RecommendButton";


const Filter = () => {

    return (
        <Flex wrap="wrap" pb={3} justifyContent="space-between" >
            <Box borderRadius="md">
                <CategoryDialog/>
                <LocationDialog/>
            </Box>
            {/* 회원 전용 추천 버튼 */}
            <Box borderRadius="md" >
                <RecommendButton />
            </Box>
        </Flex>
    );
}

export default Filter;