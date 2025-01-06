import { Card, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

/**
 * 북마크 카드 컴포넌트
 * 음식점의 썸네일, 이름, 평점, 즐겨찾기 수를 표시합니다.
 */

const BookmarkCard = ({ name, rating, thumbnail, eateryNo }) => {
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [error, setError] = useState(false); // 에러 상태
  const [formError, setFormError] = useState(""); // 에러 메시지

  // Spring 프록시를 통해 이미지를 로드하기 위한 URL 생성
  const proxyThumbnail = `https://port-0-forklog-m10lhqc01e8bd7d0.sel4.cloudtype.app/proxy/image?url=${encodeURIComponent(thumbnail)}`;

  useEffect(() => {
    const fetchFavoritesCount = async () => {
      try {
        const response = await fetch(`/main/eateries/${eateryNo}/favorites/count`);
        if (response.ok) {
          const count = await response.json();
          setFavoritesCount(count);
        } else {
          throw new Error("즐겨찾기 카운트를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        setError(true);
        setFormError("즐겨찾기 정보를 가져오는 데 문제가 발생했습니다.");
      }
    };

    fetchFavoritesCount();
  }, [eateryNo]);

  return (
    <Card.Root maxW="sm" borderRadius="lg" overflow="hidden" boxShadow="md">
      {error && (
        <Text color="red.500" mb="4">
          {formError}
        </Text>
      )}
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
        <Card.Description textAlign="right" color="gray.500" fontSize="sm" mr="10px">
          ★ {rating} | 즐겨찾기 {favoritesCount}개
        </Card.Description>
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