import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { FaEye } from "react-icons/fa";
import { RiBookmarkLine } from "react-icons/ri";

import { Card, Flex, Image, Text } from "@chakra-ui/react";

const Maincard = ({ no }) => {
  // 서버에 음식점 상세 정보 요청
  const [eatery, setEatery] = useState({});

  useEffect(() => {
    axios(`http://localhost:8080/main/eateries/${no}`, { method: "GET" })
      .then((response) => response.data)
      .then((data) => {
        // 마크업으로 작성된 설명 부분 평문으로 변환
        let div = document.createElement("div");
        div.innerHTML = data.description;
        setEatery({ ...data, description: div.textContent || div.innerText });
      })
      .catch((error) => {
        console.log("error : " + error);
      });
  }, [no]);

  const navigate = useNavigate();

  // 상세 페이지로 이동
  const handleCardClick = () => {
    navigate(`/detail/${eatery.no}`);
  };

  return (
    <Card.Root
      maxW="sm"
      overflow="hidden"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <Image
        src={eatery.thumbnail}
        alt="이미지 없음"
        objectFit="cover" // 이미지 크기와 비율을 유지하도록 설정
        width="100%" // 카드의 너비에 맞춰 이미지 크기 조정
        height="200px" // 고정된 높이 설정
      />

      <Card.Body gap="2" minHeight="120px">
        <Card.Title>{eatery.name}</Card.Title>
        <Card.Description>
          {eatery?.categoryDto?.categoryGroupDto?.name}{" "}
          {eatery?.categoryDto?.name}
        </Card.Description>
      </Card.Body>
      <Card.Footer display="block">
        {/* 조회수 및 즐겨찾기 수 */}
        <Flex alignItems="center" padding="1" gap={4}>
          {" "}
          {/* gap을 추가하여 간격을 설정 */}
          <Flex alignItems="center">
            <Text as={RiBookmarkLine} marginRight="5px"></Text>
            <Text>{eatery.favoritesCount}</Text>
          </Flex>
          <Flex alignItems="center">
            <Text as={FaEye} marginRight="5px"></Text>
            <Text>{eatery.viewCount}</Text>
          </Flex>
        </Flex>
      </Card.Footer>
    </Card.Root>
  );
};

export default Maincard;
