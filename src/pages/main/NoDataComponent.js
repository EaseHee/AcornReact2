import {Box, Button, Text} from "@chakra-ui/react";
import {resetFilter} from "../../redux/slices/filterSlice";
import {useDispatch} from "react-redux";
import MySpinner from "../../components/Spinner";
import {useEffect, useState} from "react";

const NoDataComponent = () => {
    const dispatch = useDispatch();
    const [showNoData, setShowNoData] = useState(false);

    const resetHandler = () => {
        dispatch(resetFilter());
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowNoData(true); // 일정 시간 후 "데이터 없음" 메시지를 표시
        }, 1000); // 1초 대기
        return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
    }, []);

    if (!showNoData) {
        return (
            <Box
                height="fit-content"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <MySpinner />
            </Box>
        );
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