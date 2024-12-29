import { Tabs, Box, VStack, Text } from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineReviews } from "react-icons/md";
import { RiBookMarkedLine } from "react-icons/ri";
import MyBookmark from "./MyBookmark";
import MyReview from "./MyReview";
import ProfileForm from "./ProfileForm";
import { useEffect, useState } from "react";
import axios from "axios";

const MyPage = () => {
  const [nickname, setNickname] = useState(""); // 닉네임 상태 관리

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        // 서버에서 사용자 정보를 가져옵니다.
        const response = await axios.get("http://localhost:8080/members/read", {
          withCredentials: true, // 쿠키를 함께 전송하도록 설정
        });
        setNickname(response.data.nickname); // 응답에서 닉네임을 설정
      } catch (error) {
        console.error("닉네임을 가져오는 데 실패했습니다:", error);
      }
    };

    fetchNickname();
  }, []);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginTop="10vh"
        //marginBottom="5vh"
        paddingX="25vw"
      >
        <Text fontSize="2xl" fontWeight="bold">
          {nickname} 님 환영
        </Text>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        height="100vh"
        paddingX="20vw"
      >
        <VStack spacing="6" width="100%">
          <Tabs.Root defaultValue="bookmarks" width="100%">
            <Tabs.List
              display="flex"
              justifyContent="center"
              alignItems="center"
              padding="4"
              rounded="md"
            >
              <Tabs.Trigger
                value="bookmarks"
                fontSize="lg"
                p="4"
                mx="10"
                display="flex"
                alignItems="center"
              >
                <RiBookMarkedLine style={{ marginRight: "8px" }} />
                즐겨찾기
              </Tabs.Trigger>
              <Tabs.Trigger
                value="reviews"
                fontSize="lg"
                p="4"
                mx="10"
                display="flex"
                alignItems="center"
              >
                <MdOutlineReviews style={{ marginRight: "8px" }} />
                리뷰
              </Tabs.Trigger>
              <Tabs.Trigger
                value="profile"
                fontSize="lg"
                p="4"
                mx="10"
                display="flex"
                alignItems="center"
              >
                <CgProfile style={{ marginRight: "8px" }} />
                내 정보
              </Tabs.Trigger>
            </Tabs.List>
            <Box
              bg="white"
              p="6"
              rounded="md"
              mt="4"
              shadow="md"
              textAlign="center"
              minHeight="200px"
            >
              <Tabs.Content value="bookmarks">
                <Box textAlign="left">
                  <MyBookmark />
                </Box>
              </Tabs.Content>
              <Tabs.Content value="reviews">
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  width="100%"
                  minHeight="200px"
                  ml="10"
                >
                  <MyReview />
                </Box>
              </Tabs.Content>
              <Tabs.Content value="profile">
                <Box textAlign="left">
                  <ProfileForm />
                </Box>
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </VStack>
      </Box>
    </>
  );
};

export default MyPage;
