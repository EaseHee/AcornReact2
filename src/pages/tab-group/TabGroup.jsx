import React from 'react';
import { Tabs } from '@chakra-ui/react';
import StarReviews from './Tabs/StarReviews';
import FreeComments from './Tabs/FreeComments';
import BlogReviews from './Tabs/BlogReviews';

export default function TabGroup() {
  return (
    <Tabs.Root variant="outline" defaultValue="star-reviews">
      <Tabs.List>
        <Tabs.Trigger value="star-reviews">별점 리뷰</Tabs.Trigger>
        <Tabs.Trigger value="free-comments">자유 댓글</Tabs.Trigger>
        <Tabs.Trigger value="blog-reviews">블로그 리뷰</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="star-reviews">
        <StarReviews />
      </Tabs.Content>
      <Tabs.Content value="free-comments">
        <FreeComments />
      </Tabs.Content>
      <Tabs.Content value="blog-reviews">
        <BlogReviews />
      </Tabs.Content>
    </Tabs.Root>
  );
}
