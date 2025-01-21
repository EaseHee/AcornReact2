import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { Box, Card, Text } from "@chakra-ui/react"

import axios from "utils/axios";

import MySpinner from "components/Spinner.js";
import Swiper from "components/swiper/review/StarReviewSwiper";

import CustomDialog from './CustomDialog';
import DeleteDialog from './DeleteDialog.js'

import { getStarRating } from 'components/StarRating'

const StarReviewCard = ({memberNo,nickname, sortBy}) => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1); // 현재 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 추가 데이터가 있는지 여부
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const [error, setError] = useState(false);
  const [formError, setFormError] = useState("");
  // 서버에서 리뷰 데이터를 가져오는 함수
  const fetchReviews = async (currentPage) => {
    setIsLoading(true); // 로딩 시작
    try {
      const response = await axios.get(`/main/mypage/review/member/${memberNo}`, {
        params: { page: currentPage }, // 쿼리 매개변수 설정
      });
      const { content, page: pageInfo } = response.data.list;
    // 중복된 리뷰가 추가되지 않도록 처리
    setReviews((prevReviews) => {
      const newReviews = content.filter(review => 
        !prevReviews.some(prevReview => prevReview.no === review.no)
      );
      return [...prevReviews, ...newReviews];
    });
      // 모든 페이지 로드 완료 여부 확인
      setHasMore(pageInfo.number < pageInfo.totalPages);
      setIsLoading(false); // 로딩 완료
    } catch (error) {
      setError(true);
      setFormError("리뷰를 불러오는 데 실패했습니다.", error);
      setIsLoading(false); // 오류 발생 시 로딩 상태 해제
    }
  };
  // 데이터 정렬
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "createdAt") {
      return new Date(b.createdAt) - new Date(a.createdAt); // 최신순
    } else if (sortBy === "rating") {
      return b.rating - a.rating; // 평점순
    }
    return 0;
  });
  // 초기 데이터 로드
  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  // 다음 페이지를 로드하는 함수
  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1); // 페이지 번호 증가
    }
  };

  const refreshReviews = async () => {
    setReviews([]); // 기존 데이터 초기화
    setPage(1);     // 첫 페이지로 초기화
    setHasMore(true); // 추가 데이터 로드 가능 상태로 초기화
    await fetchReviews(1); // 첫 페이지 데이터 다시 로드
  };
  return (
    <div
      id="scrollableDiv"
      style={{
        height: "500px", // 고정 높이
        width: "100%", // 고정 너비
        overflowY: "auto", // 세로 스크롤 활성화
        overflowX: "hidden", // 가로 스크롤 비활성화
      }}
    >
      {error && (
        <Text color="red.500" mb="4">
          {formError}
        </Text>
      )}
      <InfiniteScroll
        scrollableTarget="scrollableDiv"
        dataLength={sortedReviews.length} // 현재까지 로드된 데이터 개수
        next={loadMore} // 다음 데이터를 가져오는 함수
        hasMore={hasMore} // 추가 데이터가 있는지 여부
        loader={isLoading ? <MySpinner alignSelf="center"/> : null} // 로딩 중일 때 표시되는 컴포넌트
        endMessage={<p style={{ textAlign: "center" }}>모든 리뷰를 로드했습니다.</p>}
      >
        {sortedReviews.map((review, index) => (
          <Card.Root maxW="svw" overflow="hidden"  key={`${review.no}-${index}`} style={{ marginBottom: "16px" }}>
          <Card.Body >
            <Box display="flex" justifyContent="space-between" alignItems="center">
            <Card.Title alignSelf="flex-start">{review.reviewEateriesDto.name}</Card.Title>
            <Box display="flex" alignItems="center">
            <CustomDialog
              alignSelf="end"
              openBtnText="수정"
              title={nickname}
              review={review}
              memberNo={memberNo}
              confirmBtnText="수정"
              closeBtnText="취소"
              onReviewSubmitted={() => refreshReviews()}
            />
            <DeleteDialog reviewNo={review.no} onReviewSubmitted={() => refreshReviews()} />
            </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Card.Description>
                {getStarRating(review.rating)}
                {/*{nickname}*/}
              </Card.Description>
              <Box fontSize="xs" display="flex" alignSelf="flex-end">
                작성일: {review.createdAt.replace('T', ' ')}<br/>
                수정일: {review.updatedAt.replace('T', ' ')}
              </Box>
            </Box>
            <br/>
            {review.content}
          </Card.Body>
          <Card.Footer w="80%" alignSelf="center">
            {review.reviewImagesResponseDto.length>0 ?<Swiper ImgInfo={review.reviewImagesResponseDto}/>:null} 
          </Card.Footer>
        </Card.Root>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StarReviewCard;
