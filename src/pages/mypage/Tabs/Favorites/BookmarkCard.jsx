import { Card, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

/**
 * 북마크 카드 컴포넌트
 * 음식점의 썸네일, 이름, 평점, 즐겨찾기 수를 표시합니다.
 */

const BookmarkCard = ({ name, rating, thumbnail, eateryNo }) => {
  // 즐겨찾기 수를 관리하는 상태
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Spring 프록시를 통해 이미지를 로드하기 위한 URL 생성
  // encodeURIComponent로 URL을 한 번만 인코딩 (서버에서 두 번 디코딩)
  const proxyThumbnail = `http://localhost:8080/proxy/image?url=${encodeURIComponent(thumbnail)}`;

  // 컴포넌트 마운트 시 즐겨찾기 수
  useEffect(() => {
    const fetchFavoritesCount = async () => {
      try {
        const response = await fetch(`http://localhost:8080/main/eateries/${eateryNo}/favorites/count`);
        if (response.ok) {
          const count = await response.json();
          setFavoritesCount(count);
        } else {
          console.error('Failed to fetch favorites count');
        }
      } catch (error) {
        console.error('Error fetching favorites count:', error);
      }
    };

    fetchFavoritesCount();
  }, [eateryNo]); // eateryNo가 변경될 때만 실행

  return (
    <Card.Root maxW="sm" borderRadius="lg" overflow="hidden" boxShadow="md">
      {/* 음식점 상세 페이지 링크 */}
      <Link to={`/detail/${eateryNo}`}>
        <Image
          src={proxyThumbnail}
          alt={`${name} 이미지`}
          objectFit="cover"
          height="200px"
          width="100%"
        />
      </Link>

      <Card.Body p={4}>
        {/* 평점과 즐겨찾기 수 표시 */}
        <Card.Description
          textAlign="right"
          color="gray.500"
          fontSize="sm"
          mr="10px"
        >
          ★ {rating} | 즐겨찾기 {favoritesCount}개
        </Card.Description>

        {/* 음식점 이름과 링크 */}
        <Link to={`/detail/${eateryNo}`}>
          <Text fontSize="xl" fontWeight="bold" mt={2} noOfLines={1}>
            {name}
          </Text>
        </Link>
      </Card.Body>
    </Card.Root>
  );
};

export default BookmarkCard;