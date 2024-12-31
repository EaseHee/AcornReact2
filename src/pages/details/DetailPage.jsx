import React, { useEffect, useState } from 'react';
import { Box } from "@chakra-ui/react";
import ImageSlider from './ImageSlider'
import RestaurantInfo from './RestaurantInfo'
import Map from './Map'
import ReviewTabs from './ReviewTabs'
import axios from 'axios';
import BlogReviews from './Tabs/BlogReviews';
import { useParams } from "react-router-dom";

const DetailPage = () => {
  const { no } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [memberNo, setMemberNo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      console.error("사용자 정보 조회 실패:", err);
      setMemberNo(null); // 로그인되지 않은 경우 null로 처리
    }
  };

  fetchUserInfo();
}, []);


  // 식당 정보 가져오기
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/main/eateries/${no}`);
        setRestaurant(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantData();
  }, [no]);

  if (isLoading) return <Box>로딩 중...</Box>;
  if (error) return <Box>에러: {error}</Box>;
  if (!restaurant) return <Box>식당 정보를 찾을 수 없습니다</Box>;

  return (
    <Box>
      <ImageSlider restaurant={restaurant}/>
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
      <ReviewTabs restaurant={restaurant}>
        <BlogReviews />
      </ReviewTabs>
    </Box>
  );
};

export default DetailPage;