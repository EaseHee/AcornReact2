import React from 'react';
import { Tabs } from '@chakra-ui/react';
import BlogReviews from './Tabs/BlogReviews';
import StarReviews from './Tabs/StarReviews';
import FreeComments from './Tabs/FreeComments';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const ReviewTabs = () => {
  return (
    <Tabs.Root mt={4} variant="enclosed" defaultValue="stars">
      <Tabs.List>
        <Tabs.Trigger value="stars">별점 리뷰</Tabs.Trigger>
        <Tabs.Trigger value="comments">자유 댓글</Tabs.Trigger>
        <Tabs.Trigger value="blog">블로그 리뷰</Tabs.Trigger>
      </Tabs.List>

      <QueryClientProvider client={queryClient}>
        <Tabs.Content value="stars">
          {/* 별점 리뷰 공간 */}
          <StarReviews />
        </Tabs.Content>
        <Tabs.Content value="comments">
          {/* 자유 댓글 공간 */}
          <FreeComments eateryNo={restaurant.no} />
        </Tabs.Content>
        <Tabs.Content value="blog">
          {/* 블로그 리뷰 공간 */}
          <BlogReviews />
        </Tabs.Content>
      </QueryClientProvider>
    </Tabs.Root>
  );
};

export default ReviewTabs;
