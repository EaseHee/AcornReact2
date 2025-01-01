import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "utils/axios";

import { FaEye } from "react-icons/fa";
import { RiBookmarkLine } from "react-icons/ri";

import { Box, Card, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { MdCategory } from "react-icons/md";

const Maincard = ({ no }) => {
  // 서버에 음식점 상세 정보 요청
  const [eatery, setEatery] = useState({});

  useEffect(() => {
    axios(`/main/eateries/${no}`, {
      method: "GET",
      withCredentials: true,
    })
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
    // 음식점 상세 페이지 접근 시 조회 수 증가 요청
    axios(`/main/eateries/${no}/viewcount`, { method: "PUT" })
      .then((response) => response.data)
      .then((data) => {})
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

  return (
    <Card.Root
      maxW="sm"
      overflow="hidden"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        height="150px"
        bg="gray.200"
        borderRadius="md"
      >
        {blockedDomains.some((domain) => eatery.thumbnail?.includes(domain)) ? (
          // 차단된 도메인의 경우
          <MdCategory style={{ fontSize: "81px", color: "gray" }} />
        ) : (
          // 차단되지 않은 경우
          <Image
            src={eatery.thumbnail}
            onError={(e) => (e.target.style.display = "none")} // 이미지 로드 실패 시 숨김
            height="150px"
            width="100%"
            alt="음식점 이미지"
            objectFit="cover"
            borderRadius="md"
          />
        )}
      </Flex>
    </Card.Root>
  );
};
export default Maincard;
