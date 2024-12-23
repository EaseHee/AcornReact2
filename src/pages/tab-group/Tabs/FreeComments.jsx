import React from 'react';
import InfiniteScroll from '../../../components/InfiniteScrollDemo';
import { Button, Card, Flex, Textarea } from '@chakra-ui/react';

export default function FreeComments() {
  return (
    <Card.Root w="11/12" mx="auto">
      <Card.Header>
        <h2>자유 댓글</h2>
      </Card.Header>
      <Card.Body>
        <Flex paddingX="4" height="120px">
          <Textarea placeholder="댓글을 입력하세요..." size="md" resize="none" height="100%" />
          <Button height="100%">댓글 쓰기</Button>
        </Flex>
        <InfiniteScroll url={'https://jsonplaceholder.typicode.com/todos'} />
      </Card.Body>
    </Card.Root>
  );
}
