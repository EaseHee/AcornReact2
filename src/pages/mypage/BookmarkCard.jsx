import { Card, Image, Text } from "@chakra-ui/react";

const BookmarkCard = ({ name, rating, bookmarks }) => {
  return (
    <Card.Root maxW="sm" borderRadius="lg" overflow="hidden" boxShadow="md">
      <Image
        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        alt={`${name} 이미지`}
        objectFit="cover"
      />
      <Card.Body p={4}>
        <Card.Description
          textAlign="right"
          color="gray.500"
          fontSize="sm"
          mr="10px"
        >
          ★ {rating} | 북마크 {bookmarks}개
        </Card.Description>
        <Text fontSize="xl" fontWeight="bold" mt={2} noOfLines={1}>
          {name}
        </Text>
      </Card.Body>
    </Card.Root>
  );
};

export default BookmarkCard;
