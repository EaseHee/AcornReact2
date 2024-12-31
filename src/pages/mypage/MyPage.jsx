import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from 'react';
import MyTabs from './MyTabs'
import axios from "axios";
const MyPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nickname, setNickname] = useState(""); // 닉네임 상태 관리
  const [memberNo, setMemberNo] = useState(null); // memberNo 상태 관리
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const response = await axios.get("http://localhost:8080/main/mypage/members/read", {
          withCredentials: true, // 쿠키를 함께 전송하도록 설정
        });
        setNickname(response.data.nickname); // 응답에서 닉네임을 설정
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNickname();
  }, []);

  // 사용자 정보(memberNo) 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8080/main/mypage/members/member-no", {
          withCredentials: true,
        });
        
        if (response.data) {
          setMemberNo(response.data);
        }
      } catch (err) {
        console.error("사용자 정보 조회 실패:", err);
        setError("로그인이 필요한 서비스입니다.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserInfo();
  }, []);

  if (loading) return <Box>로딩 중...</Box>;
  if (error) return <Box>에러: {error}</Box>;
  if (!memberNo) return <Box p={4}>로그인이 필요한 서비스입니다.</Box>;
  
  
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