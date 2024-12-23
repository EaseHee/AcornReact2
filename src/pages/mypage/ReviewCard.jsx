import { Box, Card, Image } from "@chakra-ui/react";
import { CloseButton } from "../../components/ui/close-button";

const ReviewCard = ({ rating, name, date, description }) => {
  return (
    <Card.Root flexDirection="row" overflow="hidden" width="full" maxW="2xl">
      <Image
        objectFit="cover"
        maxW="200px"
        src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
        alt="리뷰 사진"
      />
      <Box flex="1">
        <Card.Body>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="full"
          >
            <Card.Description
              textAlign="right"
              color="gray.500"
              fontSize="sm"
              mr="10px"
            >
              ★ {rating} | {name} | {date}
            </Card.Description>
            <CloseButton />
          </Box>
          <Card.Description>{description}</Card.Description>
        </Card.Body>
      </Box>
    </Card.Root>
  );
};

export default ReviewCard;
