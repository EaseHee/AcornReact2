import React from 'react';
import { Tabs } from '@chakra-ui/react';
import BlogReviews from './Tabs/BlogReviews';
import StarReviews from './Tabs/StarReview/StarReviews';
import FreeComments from './Tabs/FreeComments';
import { QueryClient, QueryClientProvider } from 'react-query';
import { FaRegCommentAlt, FaRegStar } from 'react-icons/fa';
import { RiBloggerLine } from 'react-icons/ri';

const queryClient = new QueryClient();

const ReviewTabs = ({ restaurant, no }) => {
  return (
    <Tabs.Root mt={4} variant="line" defaultValue="stars">
      <Tabs.List style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
        <Tabs.Trigger value="stars" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.1rem" }}><FaRegStar />별점 리뷰</Tabs.Trigger>
        <Tabs.Trigger value="comments" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.1rem" }}><FaRegCommentAlt />자유 댓글</Tabs.Trigger>
        <Tabs.Trigger value="blog" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.1rem" }}><RiBloggerLine />블로그 리뷰</Tabs.Trigger>
      </Tabs.List>

      <QueryClientProvider client={queryClient}>
        <Tabs.Content value="stars">
          {/* 별점 리뷰 공간 */}
          <StarReviews no={no} />
        </Tabs.Content>
        <Tabs.Content value="comments">
          {/* 자유 댓글 공간 */}
          <FreeComments eateryNo={restaurant.no} />
        </Tabs.Content>
        <Tabs.Content value="blog">
          {/* 블로그 리뷰 공간 */}
          <BlogReviews restaurant={restaurant} />
        </Tabs.Content>
      </QueryClientProvider>
    </Tabs.Root>
  );
};

export default ReviewTabs;
