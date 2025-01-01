import { Card, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState  } from "react";

const BookmarkCard = ({ name, rating, thumbnail, eateryNo }) => {
  const [favoritesCount, setFavoritesCount] = useState(0); // 상태 정의

  // Spring 프록시 URL
  const proxyThumbnail = `http://localhost:8080/proxy/image?url=${encodeURIComponent(thumbnail)}`;

  // 즐겨찾기 총 갯수 가져오기
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
  }, [eateryNo]); // eateryNo가 변경될 때마다 호출

  return (
    <Card.Root maxW="sm" borderRadius="lg" overflow="hidden" boxShadow="md">
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
        <Card.Description
          textAlign="right"
          color="gray.500"
          fontSize="sm"
          mr="10px"
        >
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
