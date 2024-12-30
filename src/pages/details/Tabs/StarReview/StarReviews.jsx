import { Box, Button, Card, HStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import StarReviewCard from './StarReviewCard';
import CustomDialog from '../../../../components/CustomDialog';
import CreateReview from './CreateReview';
import axios from 'axios';
export default function StarReviews({no}) {
  const [sortBy, setSortBy] = useState("createdAt"); // 기본 정렬 기준
  const [memberNo,setMemberNo] = useState("");
  const [nickName,setNickName] = useState("");
  const [reviewData, setReviewData] = useState({ formData: {}, files: [] });
  const handleSortChange = (criterion) => {
    setSortBy(criterion); // 정렬 기준 업데이트
  };
  useEffect(()=>{
    const fetchMemberNo = async () => {
      try {
        // 서버에서 사용자 정보를 가져옵니다.
        const response = await axios.get("http://localhost:8080/members/read", {
          withCredentials: true, // 쿠키를 함께 전송하도록 설정
        });
        setMemberNo(response.data.no); // 응답에서 회원 번호를 설정
        setNickName(response.data.nickName); // 응답에서 닉네임을 설정
      } catch (error) {
        console.error("닉네임을 가져오는 데 실패했습니다:", error);
      }
    };
    fetchMemberNo();
  }, []);
  // 리뷰 등록 요청 함수
  const handleCreateReview = async (reviewData) => {
    const { formData, files } = reviewData;
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
    files.forEach((file) => payload.append('files', file));
    try {
      console.log(payload);
      const response = await axios.post(`http://localhost:8080//review/member/${memberNo}`,payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("리뷰가 성공적으로 등록되었습니다:", response.data);
      // 등록 성공 후 추가 처리 (예: 리뷰 목록 갱신)
    } catch (error) {
      console.error("리뷰 등록에 실패했습니다:", error);
    }
  };
  return (
    <Card.Root w="11/12" mx="auto">
      <Card.Header>
        <HStack justifyContent="space-between">
          <Box>
            <Button mr="3" onClick={() => handleSortChange("createdAt")} variant={sortBy === "createdAt" ? "subtle" : "outline"}>최신순</Button>
            <Button onClick={() => handleSortChange("rating")} variant={sortBy === "rating" ? "subtle" : "outline"}>추천순</Button>
          </Box>
          <Box>
            <CustomDialog
              openBtnText="리뷰 쓰기"
              title={nickName}
              body={<CreateReview memberNo={memberNo} eateryNo={no} onChange={setReviewData} />}
              confirmBtnText="등록"
              closeBtnText="취소"
              onConfirm={()=>handleCreateReview(reviewData)} // Axios 요청 함수 연결
            />
          </Box>
        </HStack>
      </Card.Header>
      <Card.Body>
        <StarReviewCard eateryNo={no} sortBy={sortBy} />
      </Card.Body>
    </Card.Root>
  );
}
