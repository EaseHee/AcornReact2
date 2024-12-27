import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Button, Card, Image } from "@chakra-ui/react"

const Maincard = ({no}) => {
  // 서버에 음식점 상세 정보 요청
  const [eatery, setEatery] = useState({});

  useEffect (() => {
    axios(`http://localhost:8080/main/eateries/${no}`, {method: "GET"})
    .then(response => {
      return response.data;
    })
    .then(data => {
      // 마크업으로 작성된 설명 부분 평문으로 변환
      let div = document.createElement('div');
      div.innerHTML = data.description;
      setEatery({...data, description: div.textContent || div.innerText});
    })
    .catch(error => {
      console.log("error : " + error);
    })
  }, [no]);

  const navigate = useNavigate();

  // 상세 페이지로 이동
  const handleCardClick = () => {
    navigate(`/detail/${eatery.no}`);
  }

  
  return (
    <Card.Root maxW="sm" overflow="hidden" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <Image
        src={eatery.thumbnail}
        alt="이미지 없음"
      />
      <Card.Body gap="2">
        <Card.Title>{eatery.name}</Card.Title>
        <Card.Description>{eatery.description}</Card.Description>
      </Card.Body>
      <Card.Footer>
        <Button variant="solid">{eatery.viewCount}</Button>
        <Button variant="ghost">{eatery.favoritesCount}</Button>
      </Card.Footer>
    </Card.Root>
  )
}

export default Maincard;