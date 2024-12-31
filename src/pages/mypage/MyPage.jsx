import { Tabs, Box, VStack, Text } from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineReviews } from "react-icons/md";
import { RiBookmarkLine } from "react-icons/ri";
import MyBookmark from "./MyBookmark";
import MyReview from "./MyReview";
import ProfileForm from "./ProfileForm";
import { useEffect, useState } from "react";
import axios from "axios";

const MyPage = () => {
  const [nickname, setNickname] = useState(""); // 닉네임 상태 관리
  const [memberNo, setMemberNo] = useState(null); // memberNo 상태 추가

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        // 서버에서 사용자 정보를 가져옵니다.
        const response = await axios.get("http://localhost:8080/main/mypage/members/read", {
          withCredentials: true, // 쿠키를 함께 전송하도록 설정
        });
        setNickname(response.data.nickname); // 응답에서 닉네임을 설정
      } catch (error) {
        console.error("닉네임을 가져오는 데 실패했습니다:", error);
      }
    };

    fetchNickname();
  }, []);

  // 사용자 정보(memberNo) 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8080/main/mypage/members/member-no", {
          withCredentials: true, // 쿠키 자동 전송
        });
        
        if (response.data) {
          setMemberNo(response.data);
        }
      } catch (err) {
        console.error("사용자 정보 조회 실패:", err);
        setMemberNo(null); // 로그인되지 않은 경우 null로 처리
      }
    };
  
    fetchUserInfo();
  }, []);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginTop="10vh"
        // marginBottom="5vh"
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
        <VStack spacing="6">
          <Tabs.Root defaultValue="bookmarks">
            <Tabs.List
              display="flex"
              justifyContent="center"
              alignItems="center"
              pt="2"
              pb="2"
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
                <Box display="flex" alignItems="center" margin="0 auto" gap="4px">
                  <RiBookmarkLine style={{ fontSize: "20px" }} />
                  <Text whiteSpace="nowrap" fontSize="lg">즐겨찾기</Text>
                </Box>
              </Tabs.Trigger>
              <Tabs.Trigger
                value="reviews"
                fontSize="lg"
                p="4"
                mx="10"
                display="flex"
                alignItems="center"
              >
                <Box display="flex" alignItems="center" margin="0 auto" gap="4px">
                  <MdOutlineReviews style={{ fontSize: "20px" }} />
                  <Text whiteSpace="nowrap" fontSize="lg">리뷰</Text>
                </Box>
              </Tabs.Trigger>
              <Tabs.Trigger
                value="profile"
                fontSize="lg"
                p="4"
                mx="10"
                display="flex"
                alignItems="center"
              >
                <Box display="flex" alignItems="center" margin="0 auto" gap="4px">
                  <CgProfile style={{ fontSize: "20px" }} />
                  <Text whiteSpace="nowrap" fontSize="lg">내 정보</Text>
                </Box>
              </Tabs.Trigger>
            </Tabs.List>
            <Box
              bg="white"
              p="2"
              rounded="md"
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
