import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from 'react';
import MyTabs from './MyTabs'
import axios from "utils/axios";
import { useSelector } from "react-redux";
const MyPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nickname, setNickname] = useState("");
  const [memberNo, setMemberNo] = useState(0); // memberNo 상태 관리
  const isLoggedIn = useSelector(state=>state.auth.isLoggedIn);
  useEffect(() => {
    if(isLoggedIn){
      const fetchNickname = async () => {
        try {
          const response = await axios.get("/main/mypage/members/read", {
            withCredentials: true, // 쿠키를 함께 전송하도록 설정
          });
          setNickname(response.data.nickname); // 응답에서 닉네임을 설정
          setMemberNo(response.data.no);
        } catch (err) {
          setError("서버로부터 에러가 발생했습니다.");
        } finally {
          setLoading(false);
        }
      };
      fetchNickname();
    }
    setLoading(false);
  }, []);

  if (loading) return <Box>로딩 중...</Box>;
  if (error) return <Box>에러: {error}</Box>;
  if (!isLoggedIn) return <Box p={4}>로그인이 필요한 서비스입니다.</Box>;
  
  
  return (
    <Box>
        <Text fontSize="2xl" fontWeight="bold" ml={4}>
          {nickname}
        </Text>
      <MyTabs memberNo={memberNo} nickname={nickname}>
      </MyTabs>
    </Box>
  );
};

export default MyPage;