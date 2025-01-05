import {useCallback, useEffect, useRef, useState} from "react";
import {Button, Flex, HStack, Input, VStack,} from "@chakra-ui/react";
import axios from "utils/axios";

import {chatStyles} from "./chatStyles";
import ChatMessage from "./ChatMessage";
import useWebSocket from "./useWebSocket";
import InfiniteScroll from "react-infinite-scroll-component";

const OpenChat = () => {

    const [message, setMessage] = useState(""); // 메시지 상태
    const [chats, setChats] = useState([]); // 채팅 내역
    const [memberNo, setMemberNo] = useState(null);

    const { stompClient, connectWebSocket } = useWebSocket(setChats);

    // 페이징 처리
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // 화면 고정 위치 설정용
    const scrollRef = useRef(null);
    const inputRef = useRef(null); // Input 요소 참조

    // 사용자 정보 가져오기
    useEffect(() => {
        axios
            .get("/chat/member")
            .then((res) => setMemberNo(res.data.no))
            .catch((err) => console.error("사용자 정보 조회 실패:", err));
        connectWebSocket();
    }, []);

    /**
     * 웹소켓 연결 시 초기 데이터 서버로 요청 후
     * 스크롤 위치 조정
     * 화면 크기 변화에 따른 이벤트 핸들러 설정 -> 브라우저 종료 전 핸들러 제거 설정
     */
    useEffect(() => {
        fetchMessages();

        // 화면 크기가 조정될 때 콜백으로 호출될 메서드
        const handleResize = () => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        };

        // 화면 크기를 조정해도 포커싱을 하단으로 설정하도록 이벤트 리스너 설정(= 장착)
        window.addEventListener("resize", handleResize);

        // 컴포넌트가 언마운트 될 때 (웹소켓이 연결이 해제될 때) 이벤트 리스터 제거
        return () => { // "useEffect 훅의 return 문은 componentWillUnmount"
            window.removeEventListener("resize", handleResize);
        };
    }, [connectWebSocket]);

    // 메시지 전송 함수
    const handleSend = useCallback(() => {
        if (message.trim() && stompClient) {
            stompClient.publish({
                destination: `/pub/chat/message`,
                body: JSON.stringify({ content: message, memberNo }),
            });
            setMessage(""); // 메시지 초기화
            inputRef.current.focus(); // 메시지 전송 후에도 Input에 포커싱
        }
    }, [message, stompClient, memberNo]);

    // Enter 키로 메시지 전송 & event.nativeEvent.inComposing : 한글 입력 시 마지막 글자 중복 입력 문제에 대한 설정
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            e.preventDefault(); // 기본 Enter 동작 방지
            handleSend();
        }
    };

    // 페이지 요청 함수
    /**
     * 페이지 요청 메서드
     * 서버로 페이지 번호와 데이터 크기를 요청하여 상태변수에 저장
     * 오래된 데이터를 상단에 배치하도록 데이터 저장
     * 중복으로 조회되는 오류를 방지하기 위해 필터링 로직 작성
     *  "중복 조회 오류 해결 시 삭제"
     */
    const fetchMessages = useCallback(async () => {
        if (loading || !hasMore) return; // 로딩 중이거나 마지막 페이지일 경우 요청 중단
        setLoading(true); // 로딩 시작

        try {
            const response = await axios.get(`/chat/message`, {
                params: { page },
            });
            const data = response.data;

            setChats((prevChats) =>
                // 새로운 데이터와 기존 데이터를 합친 후 중복 제거
                [...data.content, ...prevChats]
                    .filter( // 중복 조회 오류 방지용 필터링 로직
                        (chat, index, self) =>
                            self.findIndex((c) => c.no === chat.no) === index
                    )
            );
            // GPT 도움 - 스크롤 위치를 고정하기 위해 설정한다고 하는데 실제로는 애니메이션 효과를 주기 위한 용도라고 한다.
            requestAnimationFrame(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            });
            // 입력창에 포커싱, 화면 하단에 고정을 위한 설정
            if (inputRef.current) {
                inputRef.current.focus(); // 입력창에 포커싱 (= 화면 하단에 포커싱)
                inputRef.current.scrollIntoView({ block: "center" }); // 입력창을 기준으로 화면 위치 조정
            }

            // console.log("서버 응답 데이터 : ", data);
            setHasMore(!data.last);
            setPage(prev => prev + 1);
        } catch (err) {
            console.error("채팅 내역 조회 실패:", err);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);


    return (
        <Flex {...chatStyles.container} h={"90vh"}>
            {/* 채팅 메시지 영역 */}
            <VStack
                {...chatStyles.messageBox}
                id={"chatContainer"}
                overflowY={"auto"}
                ref={scrollRef}
            >
                <InfiniteScroll
                    scrollableTarget="chatContainer"
                    dataLength={chats.length}
                    next={fetchMessages}
                    hasMore={hasMore}
                    loader={null}
                    inverse={true} // 역순 무한 스크롤 설정
                >
                    {chats?.map((chat, index) => (
                        <ChatMessage
                            key={index}
                            chat={chat}
                            previousChat={chats[index - 1]}
                            nextChat={chats[index + 1]}
                            isCurrentUser={chat.memberNo === memberNo}
                        />
                    ))}
                </InfiniteScroll>
            </VStack>

            {/* 입력 영역 */}
            <HStack spacing={3} mb="10px">
                <Input
                    ref={inputRef} // Input 요소에 ref 연결
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