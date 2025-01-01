import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdCategory } from "react-icons/md";

import {Box, Card, Flex, Image, Text} from "@chakra-ui/react";

import axios from "utils/axios";
import {RiBookmarkLine} from "react-icons/ri";
import {AiOutlineEye} from "react-icons/ai";

const MainCard = ({ data }) => {
  // 서버에 음식점 상세 정보 요청
  const [eatery, setEatery] = useState(data);

  useEffect(() => {
    // 마크업으로 작성된 설명 부분 평문으로 변환
    let div = document.createElement("div");
    div.innerHTML = data.description;
    setEatery({ ...eatery, description: div.textContent || div.innerText });

    axios(`/main/eateries/${data.no}/favorites`, {method: "GET"})
    .then(response => response.data)
    .then(data => setEatery({...eatery, favoriteCount: data}) )
    .catch(error => console.log(error));
  }, [data]);

  const navigate = useNavigate();

  // 상세 페이지로 이동
  const handleCardClick = () => {
    // 음식점 상세 페이지 접근 시 조회 수 증가 요청
    axios(`/main/eateries/${data.no}/viewcount`, { method: "PUT" })
    .then((response) => response.data)
    .catch((error) => console.log("error : " + error));

    // 상세 페이지로 이동
    navigate(`/detail/${eatery.no}`);
  };

  // thumbnail 도메인이 CORS에 차단된 경우 이미지가 출력되지 않는다.
  const blockedDomains = [
    "postfiles.pstatic.net",
    "dthumb-phinf",
    "blogfiles.pstatic.net",
  ];

  // thumbnail 차단 여부 반환 메서드 - JS.some() : 배열의 요소 중 하나라도 조건을 만족하면 true 반환 "OR 연산과 동일" _ 반대는 JS.every()
  const isThumbnailBlocked = blockedDomains.some(domain => {
    return eatery.thumbnail?.includes(domain);
  });

  return (
      <Card.Root
          maxW="sm"
          overflow="hidden"
          onClick={handleCardClick}
          style={{ cursor: "pointer" }}
      >
        <Flex
            height="150px"
            borderRadius="md"
            overflow="hidden"
            boxShadow="md"
            bg="gray.100"
        >
          {/* 이미지 출력 영역 (좌) */}
          <Box flex="3" overflow="hidden">
            {eatery.thumbnail && !isThumbnailBlocked ? (
                <Image
                    src={eatery.thumbnail}
                    height="100%"
                    width="100%"
                    objectFit="cover"
                    alt="음식점 이미지"
                />
            ) : (
                <Flex
                    align="center"
                    justify="center"
                    height="100%"
                    bg="gray.200"
                    color="gray.400"
                >
                  <MdCategory style={{ fontSize: "81px" }} />
                </Flex>
            )}
          </Box>

          {/* 정보 출력 영역 (우) */}
          <Box
              flex="2"
              p="4"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              textAlign="start"
              position="relative"
          >
            {/* 음식점 이름 */}
            <Text
                fontWeight="bold"
                fontSize="md"
                mb="auto" // 이름은 위로 밀림
            >
              {eatery.name || "음식점 이름 없음"}
            </Text>

            {/* 하단 정보 영역 */}
            <Box mt="auto" pt="2">
              {/* 카테고리 정보 */}
              <Text fontSize="sm" color="gray.500" mb="1">
                {eatery.categoryDto.name || "카테고리 정보 없음"}
              </Text>

              {/* 조회수 */}
              <Flex align="center" gap="2" fontSize="sm" color="gray.600" mb="1">
                <AiOutlineEye />
                <Text>{eatery.viewCount || 0}</Text>
              </Flex>

              {/* 즐겨찾기 */}
              <Flex align="center" gap="2" fontSize="sm" color="gray.600">
                <RiBookmarkLine />
                <Text>{eatery.favoriteCount || 0}</Text>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Card.Root>
  );
};
export default MainCard;
