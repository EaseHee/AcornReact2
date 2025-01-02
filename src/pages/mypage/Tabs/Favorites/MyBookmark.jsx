// MyBookmark.jsx
import { Grid, GridItem, Box, Text } from "@chakra-ui/react";
import BookmarkCard from "./BookmarkCard";
import { useEffect, useState } from "react";
import axios from "axios";

const MyBookmark = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        // 회원 번호 먼저 가져오기
        const memberResponse = await axios.get("http://localhost:8080/main/mypage/members/member-no", {
          withCredentials: true,
        });
        
        if (!memberResponse.data) {
          setError("로그인이 필요합니다.");
          setLoading(false);
          return;
        }

        // 해당 회원의 즐겨찾기 목록 가져오기
        const bookmarksResponse = await axios.get(`http://localhost:8080/main/mypage/favorites`, {
          withCredentials: true,
        });
        setBookmarks(Array.isArray(bookmarksResponse.data) ? bookmarksResponse.data : []);
        
        // setBookmarks(bookmarksResponse.data);
      } catch (error) {
        console.error("즐겨찾기 데이터를 가져오는 데 실패했습니다:", error);
        if (error.response?.status === 401) {
          setError("로그인이 필요합니다.");
        } else if (error.response?.status === 500) {
          setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setError("데이터를 불러오는 데 실패했습니다.", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  if (loading) return <Box p={4}>로딩 중...</Box>;
  if (error) return <Box p={4}>{error}</Box>;
  if (!bookmarks.length) return <Box p={4}>즐겨찾기한 식당이 없습니다.</Box>;

  return (
    <Grid
      templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
      gap={6}
      p={4}
    >
      {bookmarks.map((bookmark) => (
        <GridItem key={bookmark.no}>
          <BookmarkCard
            name={bookmark.name}
            rating={bookmark.rating}
            thumbnail={bookmark.thumbnail}
            address={bookmark.address}
            imageUrl={bookmark.imageUrl}
            eateryNo={bookmark.no}
          />
        </GridItem>
      ))}
    </Grid>
  );
};

export default MyBookmark;