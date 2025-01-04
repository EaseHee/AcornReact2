import React, { useState, useEffect } from "react";
import { RiBookmarkLine, RiBookmarkFill } from "react-icons/ri";
import { Button } from "../../components/ui/button";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Toaster, toaster } from "../../components/ui/toaster";
import axios from 'utils/axios';

const Favorite = ({ restaurantNo, memberNo, restaurantName }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!memberNo || !restaurantNo) return;
      
      try {
        const response = await axios.get(
          `/main/eateries/${restaurantNo}/favorites/${memberNo}`);
        
        setIsBookmarked(response.data);
      } catch (error) {
        // console.error("즐겨찾기 상태 확인 중 오류:", error);
      }
    };

    checkBookmarkStatus();
  }, [memberNo, restaurantNo]);

  const handleBookmark = async () => {
    if (!memberNo) {
      toaster.create({
        description: "로그인이 필요한 서비스입니다",
        type: "error",
      });
      return;
    }

    try {
      const response = await axios.post(
        `/main/eateries/${restaurantNo}/favorites`,
        { 
          memberNo,
          status: isBookmarked ? 0 : 1
        },
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        const newBookmarkStatus = !isBookmarked;
        setIsBookmarked(newBookmarkStatus);
        
        toaster.create({
          description: newBookmarkStatus ? "즐겨찾기에 추가되었습니다" : "즐겨찾기가 삭제되었습니다",
          type: "success",
        });
      }
    } catch (error) {
      toaster.create({
        description: "즐겨찾기 처리 중 오류가 발생했습니다",
        type: "error",
      });
    }
  };

  return (
    <DialogRoot role="alertdialog">
      <Toaster />
      <DialogTrigger asChild>
    <div 
      style={{
        display: "flex", 
        alignItems: "center", 
        cursor: "pointer",
        gap: "8px"
      }} 
    >
      <span>{isBookmarked ? "즐겨찾기 삭제" : "즐겨찾기 추가"}</span>
      {isBookmarked ? (
        <RiBookmarkFill size="24" color="#FF4500" />
      ) : (
        <RiBookmarkLine size="24" color="#4A5568" />
      )}
    </div>
  </DialogTrigger>

      <DialogContent style={{
         position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
          width: '30vw', // 뷰포트 너비의 50%
          height: '30vh', // 뷰포트 높이의 40%
          maxWidth: '800px', // 최대 너비
          maxHeight: '600px', // 최대 높이
          minWidth: '300px', // 최소 너비
          minHeight: '200px', // 최소 높이
          display: 'flex',
          flexDirection: 'column', // 수직 정렬
          justifyContent: 'space-between', // 내부 요소 간 간격 균등
          alignItems: 'center', // 수평 가운데 정렬
        }}>

        <DialogHeader
          style={{
            textAlign: 'center', // 텍스트 가운데 정렬
            marginBottom: '20px', // 아래쪽 여백
            width: '100%', // 전체 너비 사용
          }}
        >
          <DialogTitle>즐겨찾기 확인</DialogTitle>
        </DialogHeader>

        <DialogBody
          style={{
            fontSize: '1.2rem', // 글씨 크기 조정
            textAlign: 'center', // 텍스트 가운데 정렬
            flex: '1', // 남은 공간 채우기
            display: 'flex', // 내부 요소 정렬을 위해 플렉스 사용
            alignItems: 'center', // 세로 가운데 정렬
            justifyContent: 'center', // 가로 가운데 정렬
            padding: '0 20px', // 내부 여백 추가
          }}
        >
          <p>
            <b>{restaurantName}</b> 음식점을{' '}
            {isBookmarked ? (
              <>즐겨찾기에서 <b>삭제</b></>
            ) : (
              <>즐겨찾기에 <b>추가</b></>
            )}{' '}
            하시겠습니까?
          </p>
        </DialogBody>
        
        <DialogFooter
          style={{
            width: '100%', // 전체 너비
            display: 'flex', // 플렉스 박스 사용
            justifyContent: 'space-evenly', // 버튼 간격 균등
            marginTop: '20px', // 위쪽 여백
          }}
        >
          <DialogActionTrigger asChild>
            <Button colorPalette="orange" onClick={handleBookmark}>확인</Button>
          </DialogActionTrigger>
          <DialogActionTrigger asChild>
            <Button variant="outline">취소</Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default Favorite;