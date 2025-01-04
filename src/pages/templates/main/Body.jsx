import React from "react";
import { Route, Routes } from "react-router-dom";
import { Flex, Box } from "@chakra-ui/react";
import Main from "../../main/Main";
import DetailPage from "../../details/DetailPage";
import MyPage from "../../mypage/MyPage";
import OpenChat from "pages/chat/OpenChat";
import axios from "axios";
import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const Body = () => {
  const [message, setMessage] = useState(""); // 메시지 상태
  const [chats, setChats] = useState([]); // 채팅 내역
  const [chatNo, setChatNo] = useState(null); // 채팅방 번호
  const [stompClient, setStompClient] = useState(null); // STOMP 클라이언트
  const userNo = Number(sessionStorage.getItem("id")); // 사용자 번호

  // 메시지 전송 함수
  const handleSend = () => {
    if (message.trim() !== "") {
      const messagePayload = {
        chatNo: chatNo,
        content: message,
        sendOtherUser: false,
        userNo: userNo,
      };

      console.log("Sending message:", JSON.stringify(messagePayload));

      // 메시지 전송
      stompClient.publish({
        destination: `/pub/chat/room/${chatNo}`, // 서버에 메시지 전송
        body: JSON.stringify(messagePayload),
      });

      setMessage(""); // 메시지 초기화
    }
  };

  // Enter 키를 눌렀을 때 메시지 전송
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // 컴포넌트가 마운트될 때 실행되는 useEffect
  useEffect(() => {
    // 오픈 채팅방의 기존 채팅 내역 불러오기
    axios
      .get(`/chat/user/${userNo}`)
      .then((response) => {
        if (response.data.chatNo) {
          setChatNo(response.data.chatNo.no);
        }
        if (response.data.chats) {
          setChats(response.data.chats);
        }
        if (response.data.create) {
          setChatNo(response.data.create.no);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // STOMP 클라이언트 설정 및 WebSocket 연결
    const socket = new SockJS(`http://${window.location.hostname}:8080/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log("STOMP Debug: ", str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      const chatRoomId = `1_${userNo}`;
      console.log("Connected, subscribing to:", `/sub/chat/room/${chatRoomId}`);
      client.subscribe(`/sub/chat/room/${chatRoomId}`, (message) => {
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
  }, [userNo]);

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
              />
            }
          />
        </Routes>
      </Box>
    </Flex>
  );
};

export default Body;
