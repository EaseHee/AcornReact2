import React from 'react';
import { Tabs } from '@chakra-ui/react';
import BlogReviews from './Tabs/BlogReviews';
import StarReviews from './Tabs/StarReviews';
import FreeComments from './Tabs/FreeComments';

const ReviewTabs = () => {
  return (
    <Tabs.Root mt={4} variant="enclosed" defaultValue="stars">
      <Tabs.List>
        <Tabs.Trigger value="stars">별점 리뷰</Tabs.Trigger>
        <Tabs.Trigger value="comments">자유 댓글</Tabs.Trigger>
        <Tabs.Trigger value="blog">블로그 리뷰</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="stars">
        {/* 별점 리뷰 공간 */}
        <StarReviews />
      </Tabs.Content>
      <Tabs.Content value="comments">
        {/* 자유 댓글 공간 */}
        <FreeComments />
      </Tabs.Content>
      <Tabs.Content value="blog">
        {/* 블로그 리뷰 공간 */}
        <BlogReviews />
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default ReviewTabs;
