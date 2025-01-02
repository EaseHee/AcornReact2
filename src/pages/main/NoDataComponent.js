import {Box, Button, Text} from "@chakra-ui/react";
import {resetFilter} from "../../redux/slices/filterSlice";
import {useDispatch} from "react-redux";

const NoDataComponent = ({applyFilters}) => {
    const dispatch = useDispatch();

    const resetHandler = () => {
        dispatch(resetFilter());
    }

    return (
        <Box textAlign="center" mt={8}>
            <Text fontSize="lg" fontWeight="bold">검색 조건에 맞는 데이터가 없습니다.</Text>
            <Button mt={"10px"} ml={"10px"} colorPalette="orange" onClick={resetHandler}>검색 조건
                초기화</Button>
        </Box>
    )
};

export default NoDataComponent;