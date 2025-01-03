import React from "react";
import { Box, Text } from "@chakra-ui/react";
import Favorite from "./Favorite";

const RestaurantInfo = ({ restaurant, memberNo }) => {
  if (!restaurant) {
    return null;
  }

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text fontSize="xl" fontWeight="bold">
          {restaurant.name}
        </Text>
        
        <Favorite restaurantNo={restaurant.no} memberNo={memberNo} restaurantName={restaurant.name}/>
      </Box>
      <Text fontSize="sm">별점: {restaurant.rating}</Text>
      <Box display="flex" alignItems="center" gap={2} mt={2}></Box>
      <Text mt={2}>주소: {restaurant.address}</Text>
      <br />
      <Text>전화번호: {restaurant.tel}</Text>
      <br />
      <Text>카테고리: {restaurant.categoryName}</Text>
    </Box>
  );
};

export default RestaurantInfo;