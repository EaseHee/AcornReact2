import {useDispatch, useSelector} from "react-redux";

import axios from "utils/axios";

import {
    Button,
    Image, Text,
    TooltipContent,
    TooltipRoot,
    TooltipTrigger
} from "@chakra-ui/react";

import {setEateries, setRecommendation, setPage} from "../../../redux/slices/eateriesSlice";
import {useState} from "react";

const RecommendButton = () => {
    const dispatch = useDispatch();
    const {isLoggedIn} = useSelector(state => state.auth);

    const [error, setError] = useState(false);
    const [formError, setFormError] = useState("");

    const fetchRecommendations = async () => {
        if (!isLoggedIn) return;

        try {
            dispatch(setEateries([]));
            dispatch(setRecommendation(true)); // 추천 상태 활성화
            const data = await axios.get("/main/members/eateries/recommends", {
                params: {
                    page: 1,
                    size: 12
                }
            }).then(response => response.data.data);
            if (data?.content) {
                dispatch(setEateries(data.content.sort(() => Math.random() - 0.5)));
                dispatch(setPage(1)); // 페이지 초기화
            }
        } catch (error) {
            dispatch(setRecommendation(false));
            setError(true);
            setFormError("추천 데이터 목록을 가져오는 데 실패했습니다...");
        }
    };

    return (
        <TooltipRoot
            openDelay={100}
            closeDelay={500}
        >
            <TooltipTrigger asChild>
                <Button
                    onClick={fetchRecommendations}
                    bg={!isLoggedIn ? "gray.400" : "orange.600"}
                    isDisabled={!isLoggedIn} // 로그인하지 않은 경우 버튼 비활성화
                    ml={"2"}
                    cursor={isLoggedIn ? "pointer" : "default"}
                >
                    <Image
                        pt={1} pb={1} h={"inherit"}
                       src="/logo01.png" alt="forklog"
                       filter={isLoggedIn || "grayscale(100%)"}
                    />
                    <Text>추천 받기</Text>
                </Button>
            </TooltipTrigger>

            {!isLoggedIn && (
                <TooltipContent
                    bg={error ? "white" : "orange.600"}
                    color="white"
                    maxW="150px" // 툴팁 너비 설정
                    h="auto"
                    p="2" // 툴팁 내부 여백
                    mt="2"
                    position={"absolute"} // Chakra-UI 홈페이지 내 props 전달 방식인 positioning이 적용되지 않아서 custom css로 처리
                    bottom={"15px"}
                    right={"150px"}
                    borderRadius="md" // 둥근 모서리
                    textAlign="center"
                    boxShadow="lg"
                >
                    {error ? (
                        <Text color="red.500" mb="4">
                            {formError}
                        </Text>
                    ) : (
                        <Text>로그인 회원 전용입니다.</Text>
                    )}
                </TooltipContent>
            )}
        </TooltipRoot>
    );
};

export default RecommendButton;