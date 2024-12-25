import React, { useState, useEffect } from "react";
import { Box, Text, Icon, Spinner } from "@chakra-ui/react";
import { FaHeart, FaBookmark } from "react-icons/fa";
import axios from "axios";

const RestaurantInfo = ({ restaurant }) => {  // props로 데이터 받기
  if (!restaurant) {
    return null;
  }

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Text fontSize="xl" fontWeight="bold">{restaurant.name}</Text>
      <Text fontSize="sm">{restaurant.rating} (평가)</Text>
      <Box display="flex" alignItems="center" gap={2} mt={2}>
        {/* <Icon as={FaHeart} />
        <Text>123</Text>
        <Icon as={FaBookmark} />
        <Text>456</Text> */}
      </Box>
      <Text mt={2}>주소: {restaurant.address}</Text>
      <Text>전화번호: {restaurant.tel}</Text>
      <Text>카테고리: {restaurant.categoryName}</Text>
    </Box>
  );
};

export default RestaurantInfo;