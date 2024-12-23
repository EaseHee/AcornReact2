import { Box, Button, Card, HStack } from '@chakra-ui/react';
import React from 'react';
import InfiniteScroll from '../../../components/InfiniteScrollDemo';
import CustomDialog from '../../../components/CustomDialog';
import CreateReview from './dialog-body/CreateReview';

export default function StarReviews() {
  return (
    <Card.Root w="11/12" mx="auto">
      <Card.Header>
        <h2>별점 리뷰 목록</h2>
        <HStack justifyContent="space-between">
          <Box>
            <Button variant="outline" mr="3">
              최신순
            </Button>
            <Button variant="outline">추천순</Button>
          </Box>
          <Box>
            <CustomDialog
              openBtnText="리뷰 쓰기"
              title="새로운 리뷰"
              body={<CreateReview />}
              confirmBtnText="등록"
              closeBtnText="취소"
            />
          </Box>
        </HStack>
      </Card.Header>
      <Card.Body>
        <InfiniteScroll url={'https://jsonplaceholder.typicode.com/todos'} />
      </Card.Body>
    </Card.Root>
  );
}
