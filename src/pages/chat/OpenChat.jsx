import { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Input,
    Button,
    VStack,
    Text,
    HStack,
} from "@chakra-ui/react";
import axios from "utils/axios";

import { chatStyles } from "./chatStyles";
import ChatMessage from "./ChatMessage";
import useWebSocket from "./useWebSocket";

const OpenChat = () => {
    const [message, setMessage] = useState(""); // 메시지 상태
    const [chats, setChats] = useState([]); // 채팅 내역
    const [memberNo, setMemberNo] = useState(null);

    const { stompClient, connectWebSocket } = useWebSocket(setChats);

    // 사용자 정보 가져오기
    useEffect(() => {
        axios
            .get("/chat/member")
            .then((res) => res.data)
            .then((data) => setMemberNo(data.no))
            .catch((err) => console.log(err));
    }, []);

    // 메시지 전송 함수
    const handleSend = () => {
        if (message.trim() !== "" && stompClient) {
            stompClient.publish({
                destination: `/pub/chat/message`,
                body: JSON.stringify({ content: message, memberNo }),
            });
            setMessage(""); // 메시지 초기화
        }
    };

    // Enter 키로 메시지 전송
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            e.preventDefault(); // 기본 Enter 동작 방지
            handleSend();
        }
    };

    // STOMP 연결 및 기존 채팅 내역 불러오기
    useEffect(() => {
        connectWebSocket();
        axios
            .get(`/chat/message`)
            .then((response) => response.data)
            .then((data) => setChats(data))
            .catch((err) => console.log(err));
    }, [connectWebSocket]);

    return (
        <Flex {...chatStyles.container}>
            {/* 채팅 메시지 영역 */}
            <VStack {...chatStyles.messageBox}>
                {chats.map((chat, index) => (
                    <ChatMessage
                        key={index}
                        chat={chat}
                        previousChat={chats[index - 1]}
                        nextChat={chats[index + 1]}
                        isCurrentUser={chat.memberNo === memberNo}
                    />
                ))}
            </VStack>

            {/* 입력 영역 */}
            <HStack spacing={3} mb="10px">
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메시지를 입력하세요."
                    {...chatStyles.inputField}
                />
                <Button
                    onClick={handleSend}
                    isDisabled={!message.trim()}
                    {...chatStyles.sendButton}
                >
                    전송
                </Button>
            </HStack>
        </Flex>
    );
};

export default OpenChat;