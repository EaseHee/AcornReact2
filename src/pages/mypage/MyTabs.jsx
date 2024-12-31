import React from 'react';
import { Tabs } from '@chakra-ui/react';
import StarReviews from './Tabs/StarReview/StarReviews';
import ProfileForm from './Tabs/MyInfo/ProfileForm';
import MyBookmark from './Tabs/Favorites/MyBookmark';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const MyTabs = ({ memberNo, nickname }) => {
  return (
    <Tabs.Root mt={4} variant="enclosed" defaultValue="stars">
      <Tabs.List>
        <Tabs.Trigger value="favorites">즐겨 찾기</Tabs.Trigger>
        <Tabs.Trigger value="stars">별점 리뷰</Tabs.Trigger>
        <Tabs.Trigger value="comments">자유 댓글</Tabs.Trigger>
        <Tabs.Trigger value="info">내 정보</Tabs.Trigger>
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
        <Tabs.Content value="blog">          
          {/* 내 정보 */}
          <ProfileForm />
        </Tabs.Content>
      </QueryClientProvider>
    </Tabs.Root>
  );
};

export default MyTabs;
