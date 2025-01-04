import React from "react";
import { Route, Routes } from "react-router-dom";
import { Flex, Box } from "@chakra-ui/react";
import Main from "../../main/Main";
import DetailPage from "../../details/DetailPage";
import MyPage from "../../mypage/MyPage";
import OpenChat from "pages/chat/OpenChat";
import axios from "utils/axios";
import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const Body = () => {
  const [message, setMessage] = useState(""); // 메시지 상태
  const [chats, setChats] = useState([]); // 채팅 내역
  const [chatNo, setChatNo] = useState(null); // 채팅방 번호
  const [stompClient, setStompClient] = useState(null); // STOMP 클라이언트
  const [memberNo, setMemberNo] = useState(null);
  const [nickname, setNickname] = useState(null);

  useEffect(() => {
    axios.get("/main/mypage/members/read")
        .then(res => res.data)
        .then(data => setMemberNo(data.no))
        .then(data => setNickname(data.nickname))
        .catch(err => console.log(err));
  }, []);

  // 메시지 전송 함수
  const handleSend = () => {
    if (message.trim() !== "") {
      console.log("Sending message:", message, memberNo);

      // 메시지 전송
      stompClient.publish({
        destination: `/pub/chat/message`,
        body: JSON.stringify({ content: message, memberNo: memberNo }),
      });

      setMessage(""); // 메시지 초기화
    }
  };

  // Enter 키를 눌렀을 때 메시지 전송
  // 메시지 전송 함수
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault(); // 기본 Enter 동작 방지
      handleSend();
    }
  };

  // 컴포넌트가 마운트될 때 실행되는 useEffect
  useEffect(() => {
    // 오픈 채팅방의 기존 채팅 내역 불러오기
    axios
      .get(`/chat/message`)
      .then(response => response.data )
      .then(data => {
        console.log(data);
        setChats(data)
      } )
      .catch((err) => {
        console.log(err);
      });

    // STOMP 클라이언트 설정 및 WebSocket 연결
    const socket = new SockJS(`${process.env.REACT_APP_API_BASE_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log("STOMP Debug: ", str),
      reconnectDelay: 5000,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 0,
    });

    client.onConnect = () => {
      console.log("Connected, subscribing to:", `/sub/chat/message`);
      client.subscribe(`/sub/chat/message`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        setChats((prevMessages) => [...prevMessages, receivedMessage]);
      });
    };

    client.activate();
    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, []);

  return (
    <Flex
      direction="row"
      wrap="wrap"
      justify="center"
      bg="gray.50"
      p={4}
      borderRadius="md"
    >
      {/* 메인 콘텐츠 */}
      <Box
        flex={{ base: "1", md: "3" }}
        minW={{ base: "xl", md: "xl" }}
        maxW="1200px" // Header와 동일한 너비로 맞추기
        bg="white"
        borderRadius="md"
        boxShadow="md"
        p={4}
        margin="0 auto" // 가운데 정렬
      >
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/detail/:no" element={<DetailPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route
            path="/chat"
            element={
              <OpenChat
                message={message}
                setMessage={setMessage}
                handleSend={handleSend}
                handleKeyDown={handleKeyDown}
                chats={chats}
                currentMemberNo={memberNo}
                nickname={nickname}
              />
            }
          />
        </Routes>
      </Box>
    </Flex>
  );
};

export default Body;
