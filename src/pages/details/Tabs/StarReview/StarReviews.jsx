import { Box, Button, Card, HStack } from '@chakra-ui/react';
import React from 'react';
import StarReviewCard from './StarReviewCard';
import CustomDialog from '../../../../components/CustomDialog';
import CreateReview from '../dialog-body/CreateReview';

export default function StarReviews({no}) {
  return (
    <Card.Root w="11/12" mx="auto">
      <Card.Header>
        <HStack justifyContent="space-between">
          <Box>
            <Button variant="outline" mr="3">최신순</Button>
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
        <StarReviewCard no={no} />
      </Card.Body>
    </Card.Root>
  );
}
