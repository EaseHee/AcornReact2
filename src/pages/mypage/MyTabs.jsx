import React from 'react';
import { Tabs } from '@chakra-ui/react';
import StarReviews from './Tabs/StarReview/StarReviews';
import ProfileForm from './Tabs/MyInfo/ProfileForm';
import MyBookmark from './Tabs/Favorites/MyBookmark';
import { QueryClient, QueryClientProvider } from 'react-query';
import { FaRegStar, FaRegUser, FaUser } from 'react-icons/fa6';
import { FaCommentAlt, FaRegCommentAlt } from 'react-icons/fa';
import { LuBookMarked } from 'react-icons/lu';

const queryClient = new QueryClient();

const MyTabs = ({ memberNo, nickname }) => {
  return (
    <Tabs.Root mt={4} variant="line" defaultValue="favorites">
      <Tabs.List style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
        <Tabs.Trigger value="favorites" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.1rem" }}><LuBookMarked />즐겨찾기</Tabs.Trigger>
        <Tabs.Trigger value="stars" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.1rem" }}><FaRegStar />별점 리뷰</Tabs.Trigger>
        <Tabs.Trigger value="comments" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.1rem" }}><FaRegCommentAlt />자유 댓글</Tabs.Trigger>
        <Tabs.Trigger value="info" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.1rem" }}><FaRegUser />내 정보</Tabs.Trigger>
      </Tabs.List>

      <QueryClientProvider client={queryClient}>
        <Tabs.Content value="favorites">
          {/* 즐겨찾기 */}
          <MyBookmark memberNo={memberNo} />
        </Tabs.Content>

        <Tabs.Content value="stars">
          {/* 별점 리뷰 */}          
          <StarReviews memberNo={memberNo} nickname={nickname} />
        </Tabs.Content>

        <Tabs.Content value="comments">
          {/* 자유 댓글 */}
          
        </Tabs.Content>

        <Tabs.Content value="info">          
          {/* 내 정보 */}
          <ProfileForm />
        </Tabs.Content>
      </QueryClientProvider>
    </Tabs.Root>
  );
};

export default MyTabs;
