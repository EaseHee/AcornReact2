import {
    Button,
    Text,
    Flex,
    Box,
} from "@chakra-ui/react";

import {
    DialogActionTrigger,
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog";

import {FaMapMarkerAlt} from "react-icons/fa";


import {useEffect, useState} from "react";
import axios from "utils/axios";
import {useDispatch, useSelector} from "react-redux";
import {setEateries, setPage} from "../../../redux/slices/eateriesSlice";

const LocationDialog = () => {
    // 대분류, 소분류 select-box 데이터 상태변수로 관리
    const [selectedGroup, setSelectedGroup] = useState(null); // 대분류 선택 상태
    const [selectedLocation, setSelectedLocation] = useState([]); // 소분류 선택 상태

    const [locationGroups, setLocationGroups] = useState([]); // 서버에서 가져온 데이터 저장

    const location = useSelector(state => state.location);
    const dispatch = useDispatch();

    // 서버에서 지역 데이터를 가져오는 함수
    useEffect(() => {
        axios("/main/locations/filter", {
            method: "GET",
        })
            .then((response) => response.data.data)
            .then((data) => {
                console.log("지역 데이터:", data);
                setLocationGroups(data);
            })
            .catch((error) => {
                console.error("지역 데이터 요청 오류:", error);
            });
    }, []);

    // 대분류 지역 선택 시 처리 메서드
    const handleGroupSelect = group => {
        setSelectedGroup(group);
        setSelectedLocation([]); // 대분류 선택 시 소분류 초기화
    };

    // 소분류 지역 선택 시 처리 메서드 : 토글 기능 적용
    const handleLocationSelectToggle = location => {
        setSelectedLocation(prev =>
            prev.includes(location) // 소분류 항목 포함 여부에 따른 처리 구분 (토글)
                ? prev.filter(item => item !== location) // 선택 해제
                : [...prev, location] // 선택 추가
        );
    };

    const handleSubmit = async () => {
        console.log("대분류:", selectedGroup);
        console.log("소분류:", selectedLocation);

        // 대분류나 소분류 중 하나를 반드시 선택해야 함
        if (!selectedGroup) return;

        try {
            // Redux 상태 초기화
            dispatch(setPage(1));

            // 서버 요청
            const response = await axios(`/main/locations/${selectedGroup} ${selectedLocation}`, {
                method: "GET",
                params: {page: 1, size: 12},
            });
            const data = response.data.data;

            dispatch(setEateries(data.content)); // 음식점 목록 업데이트
            console.log("서버 응답 데이터:", data.content);
        } catch (error) {
            console.error("서버 요청 오류:", error);
        }
    };

    return (
        <DialogRoot>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <FaMapMarkerAlt/>
                    {selectedGroup
                        ? selectedGroup
                        : location.address.split(" ")[0] + " > " + location.address.split(" ")[1]
                    }
                    {selectedLocation && selectedLocation.length > 0 && (
                        <>
                            {" > "}
                            {selectedLocation.join(" / ")}
                        </>
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>지역 선택</DialogTitle>
                </DialogHeader>

                <DialogBody pb="4">
                    {/* 대분류 카테고리 */}
                    <Text fontWeight="medium" mb="4">
                        대분류 카테고리
                    </Text>
                    <Flex gap="2" wrap="wrap">
                        {locationGroups.map(group => (
                            <Button
                                key={group.no}
                                onClick={() => handleGroupSelect(group.name)}
                                bg={selectedGroup === group.name ? "gray.500" : "gray.100"}
                                color={selectedGroup === group.name ? "white" : "black"}
                                borderRadius="full"
                                px={4}
                                py={2}
                                _hover={{bg: "gray.500", color: "white"}}
                            >
                                {group.name}
                            </Button>
                        ))}
                    </Flex>

                    {/* 소분류 카테고리 */}
                    {selectedGroup && (
                        <Box mt={6}>
                            <Text fontWeight="medium" mb="4">
                                {locationGroups.find((group) => group.name === selectedGroup)?.name} 하위 카테고리
                            </Text>
                            <Flex gap="2" wrap="wrap">
                                {locationGroups
                                    .find((group) => group.name === selectedGroup)
                                    ?.locationsFilterDtos
                                    ?.map(location => (
                                        <Button
                                            key={location.no}
                                            onClick={() => handleLocationSelectToggle(location.name)}
                                            bg={
                                                selectedLocation.includes(location.name)
                                                    ? "gray.500"
                                                    : "gray.100"
                                            }
                                            color={
                                                selectedLocation.includes(location.name) ? "white" : "black"
                                            }
                                            borderRadius="full"
                                            px={4}
                                            py={2}
                                            _hover={{bg: "gray.500", color: "white"}}
                                        >
                                            {location.name}
                                        </Button>
                                    ))}
                            </Flex>
                        </Box>
                    )}
                </DialogBody>

                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button colorPalette="orange" onClick={handleSubmit}>적용</Button>
                    </DialogActionTrigger>
                    <DialogActionTrigger asChild>
                        <Button variant="outline">닫기</Button>
                    </DialogActionTrigger>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    );
};

export default LocationDialog;