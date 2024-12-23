import { Grid, GridItem } from "@chakra-ui/react";
import ReviewCard from "./ReviewCard";

const MyReview = () => {
  const reviews = [
    {
      rating: "4.5",
      name: "맛있는 식당",
      date: "2024-12-19",
      description: "정말 맛있었어요! 또 방문할 예정입니다.",
    },
    {
      rating: "4.0",
      name: "좋은 식당",
      date: "2024-12-18",
      description: "괜찮았어요, 추천합니다.",
    },
    {
      rating: "5.0",
      name: "최고의 식당",
      date: "2024-12-17",
      description: "여기 정말 최고에요!",
    },
  ];

  return (
    <Grid templateColumns="1fr" gap={6} width="100%">
      {reviews.map((review, index) => (
        <GridItem key={index} width="100%">
          {" "}
          <ReviewCard
            rating={review.rating}
            name={review.name}
            date={review.date}
            description={review.description}
          />
        </GridItem>
      ))}
    </Grid>
  );
};

export default MyReview;
