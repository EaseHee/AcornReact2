import { Box, VStack, Text, HStack } from "@chakra-ui/react";

const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
    });

const ChatMessage = ({ chat, previousChat, nextChat, isCurrentUser }) => {
    // 사용자명 출력 조건: 이전 메시지와 비교하여 다를 경우 출력
    const shouldShowNickname =
        !previousChat || previousChat.memberNo !== chat.memberNo;

    // 시간 출력 조건: 다음 메시지와 비교하여 다를 경우 출력
    const shouldShowTime =
        !nextChat ||
        nextChat.memberNo !== chat.memberNo ||
        formatTime(nextChat.createdAt) !== formatTime(chat.createdAt);

    return (
        <VStack
            w="100%"
            align={isCurrentUser ? "flex-end" : "flex-start"}
            spacing="3px"
            mb="6px"
        >
            {/* 사용자명 출력 (맨 위에) */}
            {shouldShowNickname && (
                <Text fontWeight="bold" mb="2px">
                    {chat.nickname}
                </Text>
            )}

            <HStack
                justifyContent={isCurrentUser ? "flex-end" : "flex-start"}
                spacing="10px"
                alignItems="center"
                ml="10px"
            >
                {/* 본인 여부에 따른 좌우 시간 정렬 */}
                {isCurrentUser && shouldShowTime && (
                    <Text fontSize="xs" color="gray.500">
                        {formatTime(chat.createdAt)}
                    </Text>
                )}

                {/* 메시지 박스 */}
                <Box
                    bg={isCurrentUser ? "#ffe0b2" : "#ffcc80"}
                    color="black"
                    px="10px"
                    py="8px"
                    borderRadius="5px"
                    minWidth="50px"
                    maxWidth="200px"
                    wordBreak="break-word"
                    boxShadow="sm"
                >
                    <Text>{chat.content}</Text>
                </Box>

                {!isCurrentUser && shouldShowTime && (
                    <Text fontSize="xs" color="gray.500">
                        {formatTime(chat.createdAt)}
                    </Text>
                )}
            </HStack>
        </VStack>
    );
};

export default ChatMessage;