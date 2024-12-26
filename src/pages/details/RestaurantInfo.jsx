import React from "react";
import { Box, Text } from "@chakra-ui/react";

const RestaurantInfo = ({ restaurant }) => {  // props로 데이터 받기
  if (!restaurant) {
    return null;
  }

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Text fontSize="xl" fontWeight="bold">{restaurant.name}</Text>
      <Text fontSize="sm"> 별점 : {restaurant.rating} </Text>
      <Box display="flex" alignItems="center" gap={2} mt={2}>
      </Box>
      <Text mt={2}>주소: {restaurant.address}</Text>
      <br />
      <Text>전화번호: {restaurant.tel}</Text>
      <br />
      <Text>카테고리: {restaurant.categoryName}</Text>
    </Box>
  );
};

export default RestaurantInfo;