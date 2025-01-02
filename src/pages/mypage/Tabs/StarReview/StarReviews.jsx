import { Box, Button, Card, HStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import StarReviewCard from './StarReviewCard';

export default function StarReviews({nickname, memberNo}) {
  const [sortBy, setSortBy] = useState("createdAt"); // 기본 정렬 기준
  const handleSortChange = (criterion) => {
    setSortBy(criterion); // 정렬 기준 업데이트
  };
  return (
    <Card.Root w="11/12" mx="auto">
      <Card.Header>
        <HStack justifyContent="space-between">
          <Box>
            <Button mr="3" onClick={() => handleSortChange("createdAt")} variant={sortBy === "createdAt" ? "subtle" : "outline"}>최신순</Button>
            <Button onClick={() => handleSortChange("rating")} variant={sortBy === "rating" ? "subtle" : "outline"}>추천순</Button>
          </Box>
        </HStack>
      </Card.Header>
      <Card.Body>
        {memberNo > 0 && <StarReviewCard memberNo={memberNo} nickname={nickname} />}
      </Card.Body>
    </Card.Root>
  );
}
