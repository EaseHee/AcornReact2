import {
  Input,
  Stack,
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

import { FaMapMarkerAlt } from "react-icons/fa";

import region from "./region.js"; // 지역 데이터를 가져오기

import { useState } from "react";
import axios from "utils/axios";
import { useDispatch } from "react-redux";
import { setEateries, setPage } from "../../../redux/slices/eateriesSlice";

const LocationDialog = () => {
  // 대분류, 소분류 select-box 데이터 상태변수로 관리
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // 모달 열림 상태

  const dispatch = useDispatch();

  // 대분류 선택 메서드
  const handleRegionSelect = (region) => {
    setSelectedRegion(region); // 대분류 선택
    setSelectedLocation(null); // 소분류 초기화
  };

  // 소분류 선택 메서드
  const handleLocationSelect = (location) => {
    setSelectedLocation(location); // 소분류 선택
  };

  const handleSubmit = async () => {
    console.log("대분류:", selectedRegion);
    console.log("소분류:", selectedLocation);

    // 대분류나 소분류 중 하나를 반드시 선택해야 함
    if (!selectedRegion) {
      console.error("대분류를 선택하세요.");
      return;
    }

    try {
      // Redux 상태 초기화
      dispatch(setPage(1));

      // 서버 요청
      const endpoint = selectedLocation // 소분류 선택 여부에 따른 api 요청명 변경
          ? selectedLocation // 소분류
          : selectedRegion; // 대분류
      const response = await axios(`/main/locations/${endpoint}`, {
        method: "GET",
        params: { page: 1, size: 12 },
      });

      const data = response.data.data;

      dispatch(setEateries(data.content)); // 음식점 목록 업데이트
      console.log("서버 응답 데이터:", data.content);
    } catch (error) {
      console.error("서버 요청 오류:", error);
    } finally {
      setIsOpen(false); // 모달 닫기
    }
  };

  return (
      <DialogRoot isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTrigger asChild>
          <Button variant="outline" >
            <FaMapMarkerAlt />
            지역 카테고리
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
              {region.map((group) => (
                  <Button
                      key={group.no}
                      onClick={() => handleRegionSelect(group.name)}
                      bg={selectedRegion === group.name ? "gray.500" : "gray.100"}
                      color={selectedRegion === group.name ? "white" : "black"}
                      borderRadius="full"
                      px={4}
                      py={2}
                      _hover={{ bg: "gray.500", color: "white" }}
                  >
                    {group.name}
                  </Button>
              ))}
            </Flex>

            {/* 소분류 카테고리 */}
            {selectedRegion && (
                <Box mt={6}>
                  <Text fontWeight="medium" mb="4">
                    {region.find((group) => group.name === selectedRegion)?.name} 하위 카테고리
                  </Text>
                  <Flex gap="2" wrap="wrap">
                    {region
                        .find((group) => group.name === selectedRegion)
                        ?.locations.map((location) => (
                            <Button
                                key={location.no}
                                onClick={() => handleLocationSelect(location.name)}
                                bg={selectedLocation === location.name ? "gray.500" : "gray.100"}
                                color={selectedLocation === location.name ? "white" : "black"}
                                borderRadius="full"
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.500", color: "white" }}
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