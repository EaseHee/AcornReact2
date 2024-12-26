import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text, Link } from "@chakra-ui/react"; // Chakra UI의 Link 사용
import fetchBlogReviews from "./BlogApi"; // API 호출 함수

// HTML 태그 제거 목적
const removeHtmlTags = (text) => {
  return text.replace(/<[^>]*>?/gm, ""); // 정규식
};

const BlogReviewTab = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBlogReviews("서울 강남 맛집"); // 검색어
      setBlogs(data);
    };
    fetchData();
  }, []);

  return (
    <Box height="100%" overflowY="auto" border="1px solid #e2e8f0" borderRadius="md" p={2}>
      {blogs.map((blog, index) => (
        <Flex
          key={index}
          p={4}
          borderBottom="1px solid #e2e8f0"
          justifyContent="space-between"
        >
          {/* 블로그 리뷰 섹션 */}
          <Box flex="3" pr={4}>
            <Link href={blog.url} isExternal> {/* isExternal : 새탭으로 블로그창 열기, chakra Link 사용 */}
              <Text fontWeight="bold" color="blue.500" _hover={{ textDecoration: "underline" }}>
                {removeHtmlTags(blog.title)} {/* HTML 태그 제거 */}
              </Text>
            </Link>
            <Text fontSize="sm" color="gray.500">
              {new Date(blog.datetime).toLocaleDateString()}
            </Text>
            <Text mt={2}>{removeHtmlTags(blog.contents)}</Text> {/* HTML 태그 제거 */}
          </Box>
          {/* 블로그 사진 섹션 */}
          <Box flex="1" maxWidth="200px"> {/* 썸네일 크기 조정 */}
            <Link href={blog.url} isExternal>
              <Image
                src={blog.thumbnail || "https://via.placeholder.com/200?text=No+Image"}
                alt={`Blog Image ${index + 1}`}
                borderRadius="md"
                objectFit="contain"
                boxSize="180px" // 크기 조정
              />
            </Link>
          </Box>
        </Flex>
      ))}
    </Box>
  );
};

export default BlogReviewTab;
