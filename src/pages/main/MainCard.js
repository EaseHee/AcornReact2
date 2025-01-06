import {memo, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { MdCategory } from "react-icons/md";

import {Box, Card, Flex, Image, Text} from "@chakra-ui/react";

import axios from "utils/axios";
import {RiBookmarkLine} from "react-icons/ri";
import {AiOutlineEye} from "react-icons/ai";
import {HiMiniStar} from "react-icons/hi2";

const MainCard = memo(({ data }) => {
  const [eatery, setEatery] = useState(data);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        // 즐겨찾기 개수 가져오기
        const favoriteCount = await axios
            .get(`/main/eateries/${data.no}/favorites/count`)
            .then((res) => res.data);

        setEatery((prev) => ({
          ...prev,
          favoriteCount,
        }));
      } catch (error) {
        console.error("추가 데이터 가져오기 오류:", error);
      }
    };

    fetchAdditionalData();
  }, [data.no]);

  const navigate = useNavigate();

  // 상세 페이지로 이동 및 조회수 업데이트
  const handleCardClick = async () => {
    try {
      await axios.put(`/main/eateries/${data.no}/view/counts`, {
        params: { no: data.no },
      });

      // 로컬 상태에서 조회수 증가
      setEatery((prev) => ({
        ...prev,
        viewCount: prev.viewCount + 1,
      }));

      // 상세 페이지로 이동
      navigate(`/detail/${eatery.no}`);
    } catch (error) {
      console.error("조회수 업데이트 실패:", error);
    }
  };

  return (
      <Card.Root
          maxW="sm"
          overflow="hidden"
          onClick={handleCardClick}
          style={{ 
            cursor: "pointer",
            
            // 마우스 호버시 이벤트 효과
            transition: "transform 0.3s ease-in-out", // 전환 효과 시간 증가
            transformOrigin: "center", // 중앙 기준으로 확대
            height: "150px" // 카드 전체 높이 고정
          }}
          _hover={{
            transform: "scale(1.05)", // 호버시 5% 크기 증가
            boxShadow: "xl" // 그림자 효과 추가
          }}
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
                <Image
                    src={`https://port-0-forklog-m10lhqc01e8bd7d0.sel4.cloudtype.app/proxy/image?url=${encodeURIComponent(eatery?.thumbnail)}`}
                    height="100%"
                    width="100%"
                    objectFit="cover"
                    alt="음식점 이미지"
                />
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
                {eatery.categoryDto?.categoryGroupsDto?.name
                    ? eatery.categoryDto?.categoryGroupsDto?.name + " > " + eatery.categoryDto.name
                    : eatery.categoryDto?.categoryGroupsDto?.name
                }
              </Text>

              {/* 별점 평점 */}
              <Flex align="center" gap="2" fontSize="sm" color="gray.600" mb="1">
                <HiMiniStar />
                <Text>{eatery.rating || "-"}</Text>
              </Flex>

              {/* 조회수 */}
              {/*<Flex align="center" gap="2" fontSize="sm" color="gray.600" mb="1">*/}
              {/*  <AiOutlineEye />*/}
              {/*  <Text>{eatery.viewCount || 0}</Text>*/}
              {/*</Flex>*/}

              {/* 즐겨찾기 */}
              <Flex align="center" gap="2" fontSize="sm" color="gray.600">
                <RiBookmarkLine />
                <Text>{eatery.favoriteCount || "-"}</Text>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Card.Root>
  );
});
export default MainCard;
