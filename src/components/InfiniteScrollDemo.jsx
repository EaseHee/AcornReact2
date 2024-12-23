import React, { useState, useEffect, useCallback } from 'react';
import { Box, VStack, Text, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';

export default function InfiniteScroll({ url }) {
  // todos 상태와 setter 함수를 정의
  const [todos, setTodos] = useState([]);
  // 현재 페이지 번호 상태와 setter 함수를 정의
  const [page, setPage] = useState(1);
  // 로딩 상태와 setter 함수를 정의
  const [loading, setLoading] = useState(false);
  // 더 불러올 데이터가 있는지 여부를 나타내는 상태와 setter 함수를 정의
  const [hasMore, setHasMore] = useState(true);
  // Intersection Observer 훅을 사용하여 ref와 inView 상태를 가져옴
  const [ref, inView] = useInView();

  // todos를 가져오는 함수를 useCallback으로 메모이제이션
  const fetchTodos = useCallback(async () => {
    // 이미 로딩 중이거나 더 불러올 데이터가 없으면 함수 종료
    if (loading || !hasMore) return;
    // 로딩 상태를 true로 설정
    setLoading(true);
    try {
      // axios를 사용하여 데이터를 가져옴
      const response = await axios.get(`${url}?_page=${page}&_limit=10`);
      // 응답에서 새로운 todos 데이터를 추출
      const newTodos = response.data;
      // 기존 todos에 새로운 todos를 추가
      setTodos((prevTodos) => [...prevTodos, ...newTodos]);
      // 페이지 번호를 1 증가
      setPage((prevPage) => prevPage + 1);
      // 새로운 todos가 있으면 hasMore를 true로, 없으면 false로 설정
      setHasMore(newTodos.length > 0);
    } catch (error) {
      // 에러 발생 시 콘솔에 에러 로그 출력
      console.error('Error fetching todos:', error);
    } finally {
      // 로딩 상태를 false로 설정
      setLoading(false);
    }
  }, [loading, hasMore, url, page]);

  // inView 상태가 변경될 때마다 실행되는 useEffect
  useEffect(() => {
    // 관찰 대상이 화면에 보이면 fetchTodos 함수 실행
    if (inView) {
      fetchTodos();
    }
  }, [inView, fetchTodos]);

  // 컴포넌트 UI를 렌더링
  return (
    <VStack spacing={4} align="stretch" p={4}>
      {/* todos 배열을 매핑하여 각 todo 항목을 렌더링 */}
      {todos.map((todo) => (
        <Box key={todo.id} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
          <Text fontWeight="bold">{todo.title}</Text>
          <Text color={todo.completed ? 'green.500' : 'red.500'}>{todo.completed ? 'Completed' : 'Not Completed'}</Text>
        </Box>
      ))}
      {/* 로딩 중일 때 스피너를 표시 */}
      {loading && <Spinner alignSelf="center" />}
      {/* 로딩 중이 아니고 더 불러올 데이터가 있을 때 관찰 대상 요소를 렌더링 */}
      {!loading && hasMore && <Box ref={ref} h="10px" />}
      {/* 더 이상 불러올 데이터가 없을 때 메시지를 표시 */}
      {!hasMore && <Text textAlign="center">더 이상 표시할 항목이 없습니다.</Text>}
    </VStack>
  );
}
