import React, { useEffect, useState } from 'react';
import { Box, Text } from "@chakra-ui/react";
import ImageSlider from './ImageSlider';
import RestaurantInfo from './RestaurantInfo';
import Map from './Map';
import ReviewTabs from './ReviewTabs';
import axios from 'utils/axios';
import BlogReviews from './Tabs/BlogReviews';
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';

const DetailPage = () => {
  const { no } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [memberNo, setMemberNo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [formError, setFormError] = useState("");
  const isLoggedIn = useSelector(state=>state.auth.isLoggedIn); // 로그인 여부 추적

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8080/main/mypage/members/member-no", {
          withCredentials: true, // 쿠키 자동 전송
        });

        if (response.data) {
          setMemberNo(response.data);
        }
      } catch (err) {
         // 사용자 정보를 가져오지 못했을 경우(비로그인), memberNo를 null로 유지
      }
    };

    fetchUserInfo();
  }, []);

  // 식당 정보 가져오기
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await axios.get(`/main/eateries/${no}`);
        setRestaurant(response.data);
      } catch (err) {
        setFormError("식당 정보를 가져오는 데 실패했습니다.");
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantData();
  }, [no]);

  if (isLoading) return <Box>로딩 중...</Box>;
  if (error) return (
    <Box>
      <Text color="red.500" mb="4">{formError}</Text>
    </Box>
  );
  if (!restaurant) return <Box>식당 정보를 찾을 수 없습니다</Box>;

  return (
    <Box>
      <ImageSlider restaurant={restaurant} />

      <Box display="flex" flexDirection={"column"} gap={3}>
        <Box flex={2}>
          <RestaurantInfo restaurant={restaurant} memberNo={memberNo} />
        </Box>
        <Box flex={1}>
          <Map
            latitude={parseFloat(restaurant.latitude)}
            longitude={parseFloat(restaurant.longitude)}
          />
        </Box>
      </Box>

      <ReviewTabs restaurant={restaurant} no={no}>
        <BlogReviews />
      </ReviewTabs>
    </Box>
  );
};

export default DetailPage;