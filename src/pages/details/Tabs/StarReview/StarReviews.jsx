import { Box, Button, Card, HStack } from '@chakra-ui/react';
import { useSelector } from "react-redux";
import React, { useEffect, useState, useRef } from 'react';
import StarReviewCard from './StarReviewCard';
import CustomDialog from './CustomDialog';
import axios from 'axios';
export default function StarReviews({no}) {
  const [sortBy, setSortBy] = useState("createdAt"); // 기본 정렬 기준
  const handleSortChange = (criterion) => {
    setSortBy(criterion); // 정렬 기준 업데이트
  };
  const [memberNo, setMemberNo] = useState(0); // 상태로 관리
  const [nickName, setNickName] = useState(""); // 상태로 관리
  const refreshReviews = useRef();
  const isLoggedIn = useSelector(state=>state.auth.isLoggedIn);
  useEffect(()=>{
    if(isLoggedIn){
      const fetchMemberNo = async () => {
        try {
          // 서버에서 사용자 정보를 가져옵니다.
          const response = await axios.get("http://localhost:8080/main/mypage/members/read", {
            withCredentials: true, // 쿠키를 함께 전송하도록 설정
          });
          setMemberNo(response.data.no); // 상태를 업데이트
          setNickName(response.data.nickname); // 상태를 업데이트
        } catch (error) {
          console.error("닉네임을 가져오는 데 실패했습니다:", error);
        }
      };
      fetchMemberNo();
    }
  }, []);
  return (
    <Card.Root w="11/12" mx="auto">
      <Card.Header>
        <HStack justifyContent="space-between">
          <Box>
            <Button mr="3" onClick={() => handleSortChange("createdAt")} variant={sortBy === "createdAt" ? "subtle" : "outline"}>최신순</Button>
            <Button onClick={() => handleSortChange("rating")} variant={sortBy === "rating" ? "subtle" : "outline"}>추천순</Button>
          </Box>
          {isLoggedIn ?
          <CustomDialog
            openBtnText="리뷰 작성"
            title={nickName}
            memberNo={memberNo}
            eateryNo={no}
            confirmBtnText="등록"
            closeBtnText="취소"
            onReviewSubmitted={() => refreshReviews.current()}
          />
          :
          null
          }
        </HStack>
      </Card.Header>
      <Card.Body>
        <StarReviewCard eateryNo={no} sortBy={sortBy} passRefresh={(fn) => (refreshReviews.current = fn)}/>
      </Card.Body>
    </Card.Root>
  );
}
