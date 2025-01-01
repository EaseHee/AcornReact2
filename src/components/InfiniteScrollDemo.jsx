import React, { useRef, useCallback } from 'react';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';
import { Box, Text } from '@chakra-ui/react';
import MySpinner from './Spinner';

// 현재 사용중이지 않은 컴포넌트
const fetchTodos = async ({ pageParam = 1, url }) => {
  // 기본 페이지는 1입니다.
  const { data } = await axios.get(`${url}?_page=${pageParam}&_limit=10`); // 페이지 매개변수를 사용하여 Todo 항목을 요청합니다.
  return data;
};

const InfiniteScrollDemo = ({ url }) => {
  // 무한 스크롤 컴포넌트 정의
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['todos', url], // 쿼리 키에 URL을 포함
    ({ pageParam }) => fetchTodos({ pageParam, url }), // fetchTodos 호출 시 URL 전달
    {
      // useInfiniteQuery를 사용하여 데이터를 가져옵니다.
      getNextPageParam: (lastPage, pages) => (lastPage.length ? pages.length + 1 : undefined), // 다음 페이지 매개변수를 결정합니다.
    }
  );

  const observerRef = useRef(); // Intersection Observer를 위한 ref 생성

  const lastTodoElementRef = useCallback(
    // 마지막 Todo 요소에 대한 ref를 설정하는 콜백 함수
    (node) => {
      if (observerRef.current) observerRef.current.disconnect(); // 이전 observer가 존재하면 연결 해제
      observerRef.current = new IntersectionObserver((entries) => {
        // 새로운 Intersection Observer 생성
        if (entries[0].isIntersecting && hasNextPage) {
          // 마지막 요소가 뷰포트에 들어오고 다음 페이지가 있는 경우
          fetchNextPage(); // 다음 페이지 데이터를 요청
        }
      });
      if (node) observerRef.current.observe(node); // 현재 노드를 관찰합니다.
    },
    [hasNextPage, fetchNextPage] // 의존성 배열: hasNextPage와 fetchNextPage 변경 시 콜백이 재생성됩니다.
  );

  return (
    <Box p={4}>
      {data?.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.map((todo, index) => {
            const isLastTodo = index === page.length - 1 && pageIndex === data.pages.length - 1; // 마지막 Todo 항목인지 확인
            return (
              <Box
                key={todo.id}
                ref={isLastTodo ? lastTodoElementRef : null} // 마지막 Todo에 ref 할당
                p={4}
                borderWidth="1px"
                borderRadius="md"
                mb={2}
              >
                <Text fontSize="lg">{todo.title}</Text>
                <Text color={todo.completed ? 'green.500' : 'red.500'}>{todo.completed ? '완료' : '미완료'}</Text>{' '}
              </Box>
            );
          })}
        </React.Fragment>
      ))}
      {isFetchingNextPage && <MySpinner />}
    </Box>
  );
};

export default InfiniteScrollDemo;
