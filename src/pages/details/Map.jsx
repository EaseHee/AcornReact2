import React, { useEffect, useState } from "react";
import axios from "axios";

import { Box, Text, Center } from "@chakra-ui/react";

import KakaoMaps from "../../utils/KakaoMaps";

const Map = ({no}) => {
  // 서버에 음식점 상세 정보 요청
  const [eatery, setEatery] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const data = await (await (axios.get(`/main/eatery/${no}`))).data;
        setEatery(data);
      } catch (error) {
        console.log("error : " + error);
      }
    })();
  }, [no]);
  console.log("eatery : ", eatery);

  const result = () => {
    if (eatery.latitude) {
      return (
        <KakaoMaps
        lat={eatery.latitude}
        lng={eatery.longitude}
        name={eatery.name}
      />
      )
    } else {
      return <Text color="gray.500">지도가 이곳에 표시될 예정입니다</Text>
    }
  }
  
  return (
    <Box 
      border="1px" 
      borderColor="gray.200" 
      borderRadius="md" 
      width="100%" 
      height="200px"
      bg="gray.100"
    >
      <Center height="100%">
        {result()}
      </Center>
    </Box>
  );
};

export default Map;