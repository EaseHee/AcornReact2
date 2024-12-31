import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from 'react';
import MyTabs from './MyTabs'
import axios from "axios";
const MyPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nickname, setNickname] = useState(""); // 닉네임 상태 관리
  const [memberNo, setMemberNo] = useState(0); // 상태로 관리
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const response = await axios.get("http://localhost:8080/main/mypage/members/read", {
          withCredentials: true, // 쿠키를 함께 전송하도록 설정
        });
        setNickname(response.data.nickname); // 응답에서 닉네임을 설정
        setMemberNo(response.data.no); // 응답에서 번호 설정
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNickname();
  }, []);
  if (isLoading) return <Box>로딩 중...</Box>;
  if (error) return <Box>에러: {error}</Box>;
  return (
    <Box>
        <Text fontSize="2xl" fontWeight="bold">
          {nickname} 님 환영합니다!
        </Text>
      <MyTabs memberNo={memberNo} nickname={nickname}>
      </MyTabs>
    </Box>
  );
};

export default MyPage;