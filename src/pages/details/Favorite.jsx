import React, { useState, useEffect } from "react";
import { RiBookmarkLine, RiBookmarkFill } from "react-icons/ri";
import axios from 'axios';

const Favorite = ({ restaurantNo, memberNo }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!memberNo || !restaurantNo) return;
      
      try {
        // 즐겨찾기 상태를 확인하기 위한 API 호출이 필요합니다
        const response = await axios.get(
          `http://localhost:8080/main/eateries/${restaurantNo}/favorites/${memberNo}`,
          { withCredentials: true }
        );
        
        setIsBookmarked(response.data);
      } catch (error) {
        console.error("즐겨찾기 상태 확인 중 오류:", error);
      }
    };

    checkBookmarkStatus();
    }, [memberNo, restaurantNo]);

    const toggleBookmark = async () => {
        if (!memberNo) {
          alert("로그인이 필요한 서비스입니다.");
          return;
        }
      
        try {
          const response = await axios.post(
            `http://localhost:8080/main/eateries/${restaurantNo}/favorites`,
            { 
              memberNo,
              status: isBookmarked ? 0 : 1  // 현재 상태의 반대값으로 설정
            },
            { withCredentials: true }
          );
      
          if (response.status === 200) {
            const newBookmarkStatus = !isBookmarked;
            setIsBookmarked(newBookmarkStatus);
            alert(newBookmarkStatus ? "즐겨찾기 되었습니다." : "즐겨찾기가 취소되었습니다.");
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            alert("로그인이 필요한 서비스입니다.");
          } else {
            console.error("즐겨찾기 처리 중 오류:", error);
            alert("즐겨찾기 처리 중 오류가 발생했습니다.");
          }
        }
    };

  return (
    <div 
      onClick={toggleBookmark}
      style={{ cursor: 'pointer' }}
    >
      {isBookmarked ? (
        <RiBookmarkFill size="24" color="#FF4500" />
      ) : (
        <RiBookmarkLine size="24" color="#4A5568" />
      )}
    </div>
  );
};

export default Favorite;