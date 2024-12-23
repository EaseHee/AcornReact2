import React from "react";
import { Box, Text, Icon } from "@chakra-ui/react";
import { FaHeart, FaBookmark } from "react-icons/fa";

const RestaurantInfo = () => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Text fontSize="xl" fontWeight="bold">닭다리 치킨 강남점</Text>
      <Text fontSize="sm">4.0 (10명 평가)</Text>
      <Box display="flex" alignItems="center" gap={2} mt={2}>
        {/* <Icon as={FaHeart} />
        <Text>123</Text>
        <Icon as={FaBookmark} />
        <Text>456</Text> */}
      </Box>
      <Text mt={2}>주소: 서울특별시 강남구 XX대로 OO길 X</Text>
      <Text>전화번호: 000-1111-2222</Text>
      <Text>카테고리: 치킨, 한식</Text>
    </Box>
  );
};


export default RestaurantInfo;
