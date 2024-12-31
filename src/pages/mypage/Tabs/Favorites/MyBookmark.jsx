import { Grid, GridItem } from "@chakra-ui/react";
import BookmarkCard from "./BookmarkCard";

const MyBookmark = () => {
  const bookmarks = [
    { id: 1, name: "맛집 A", rating: "4.5", bookmarks: 120 },
    { id: 2, name: "맛집 B", rating: "4.7", bookmarks: 98 },
    { id: 3, name: "맛집 C", rating: "4.3", bookmarks: 65 },
    { id: 4, name: "맛집 D", rating: "4.9", bookmarks: 150 },
  ];

  return (
    <Grid
      templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
      gap={6}
      p={4}
    >
      {bookmarks.map((bookmark) => (
        <GridItem key={bookmark.id}>
          <BookmarkCard
            name={bookmark.name}
            rating={bookmark.rating}
            bookmarks={bookmark.bookmarks}
          />
        </GridItem>
      ))}
    </Grid>
  );
};

export default MyBookmark;
