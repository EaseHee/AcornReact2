import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {FaMapMarkerAlt} from "react-icons/fa";

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
} from "components/ui/dialog";

import {setLocation} from "../../../redux/slices/filterSlice";
import {setRecommendation} from "../../../redux/slices/eateriesSlice";

/**
 * 지역 필터 모달 컴포넌트
 * 지역 필터 변수 Redux 상태로 관리
 *
 * 필터 조건 선택 사항은 임시로 State 훅의 로컬 상태변수로 관리하고
 * 적용 버튼을 클릭하면 Reducer에 action을 요청하여
 * 상태 변수 변경 내역을 Main 컴포넌트에 반영한다
 */
const LocationDialog = () => {
    const dispatch = useDispatch();
    const locationFilter = useSelector((state) => state.filter.location);
    const locationGroups = useSelector((state) => state.filter.locationGroups); // Redux에서 가져오기

    // 선택된 값 (selected)
    const [selectedLocationGroup, setSelectedLocationGroup] = useState(locationFilter.group);
    const [selectedLocation, setSelectedLocation] = useState(locationFilter.locations);

    // 초기값으로 설정
    useEffect(() => {
        setSelectedLocationGroup(locationFilter.group);
        setSelectedLocation(locationFilter.locations);
    }, [locationFilter]);

    const handleGroupSelect = (group) => {
        setSelectedLocationGroup(group);
        setSelectedLocation(null); // 소분류 초기화
    };

    const handleLocationSelect = (location) => {
        setSelectedLocation(prev =>
            prev && prev === location // 기존 선택값과 동일 여부 판단
                ? null // 선택 해제
                : location // 선택
        );
    };

    /**
     * 적용 버튼 클릭 시 Reducer에 Action 요청
     * 상태 변경 시 Main 컴포넌트 내 applyFilters 메서드 호출 -> 화면 재렌더링
     */
    const applyChanges = () => {
        dispatch(setRecommendation(false));
        dispatch(setLocation({group: selectedLocationGroup, locations: selectedLocation}));
    };

    /**
     * 취소 버튼 클릭 시 로컬 상태 변수 Reducer에 저장된 상태로 초기화
     */
    const resetChanges = () => {
        setSelectedLocationGroup(locationFilter.group);
        setSelectedLocation(locationFilter.locations);
    };

    return (
        <DialogRoot>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <FaMapMarkerAlt style={{color: '#FF4500'}}/>
                    {locationFilter.group || "지역 선택"}
                    {locationFilter.locations && ` > ${locationFilter.locations}`}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>지역 선택</DialogTitle>
                </DialogHeader>
                <DialogBody pb="4">
                    <Text fontWeight="medium" mb="4">대분류 지역</Text>
                    <Flex gap="2" wrap="wrap">
                        {Array.isArray(locationGroups) && locationGroups.map((group) => (
                            <Button
                                key={group.no}
                                onClick={() => handleGroupSelect(group.name)}
                                bg={selectedLocationGroup === group.name ? "orange.600" : "gray.100"}
                                color={selectedLocationGroup === group.name ? "white" : "black"}
                                borderRadius="full"
                            >
                                {group.name}
                            </Button>
                        ))}
                    </Flex>

                    {selectedLocationGroup && (
                        <Box mt="6">
                            <Text fontWeight="medium" mb="4">소분류 지역</Text>
                            <Flex gap="2" wrap="wrap">
                                {Array.isArray(locationGroups) && locationGroups
                                    .find((group) => group.name === selectedLocationGroup)
                                    ?.locationsFilterDtos.map((loc) => (
                                        <Button
                                            key={loc.no}
                                            onClick={() => handleLocationSelect(loc.name)}
                                            bg={selectedLocation === loc.name ? "orange.600" : "gray.100"}
                                            color={selectedLocation === loc.name ? "white" : "black"}
                                            borderRadius="full"
                                        >
                                            {loc.name}
                                        </Button>
                                    ))}
                            </Flex>
                        </Box>
                    )}
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button colorPalette="orange" onClick={applyChanges}>
                            적용
                        </Button>
                    </DialogActionTrigger>
                    <DialogActionTrigger asChild>
                        <Button variant="outline" onClick={resetChanges}>
                            닫기
                        </Button>
                    </DialogActionTrigger>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    );
};

export default LocationDialog;