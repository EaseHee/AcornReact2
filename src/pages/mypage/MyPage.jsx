import { Tabs, Box, VStack, Text, Link, Button } from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineReviews } from "react-icons/md";
import { RiBookMarkedLine } from "react-icons/ri";
import MyBookmark from "./MyBookmark";
import MyReview from "./MyReview";
import ProfileForm from "./ProfileForm";

const MyPage = () => {
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginTop="10vh"
        marginBottom="10vh"
        paddingX="25vw"
      >
        <Text fontSize="2xl" fontWeight="bold">
          회원명
        </Text>
        {/* <Button variant="link" fontSize="sm" p={0} minW="unset" color="orange.500" fontWeight="bold">
          프로필 수정
        </Button> */}
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
                프로필 수정
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
