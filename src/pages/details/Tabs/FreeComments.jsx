import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import {
  Box,
  Button,
  Flex,
  Text,
  Textarea,
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
} from '@chakra-ui/react';
import MySpinner from '../../../components/Spinner';

// 댓글 데이터 가져오기
const fetchComments = async ({ pageParam = 0, eateryNo }) => {
  const response = await axios.get(`http://localhost:8080/main/eateries/${eateryNo}/comments?page=${pageParam}`);
  return response.data;
};

// 댓글 작성
const postComment = async ({ eateryNo, content, memberNo }) => {
  const response = await axios.post(`http://localhost:8080/main/eateries/comments`, {
    eateryNo,
    content,
    memberNo,
  });
  return response.data;
};

// 댓글 삭제
const deleteComment = async (commentNo) => {
  const response = await axios.delete(`http://localhost:8080/main/eateries/comments/${commentNo}`);
  return response.data;
};

// 댓글 수정
const updateComment = async (commentNo, content) => {
  const response = await axios.put(`http://localhost:8080/main/eateries/comments/${commentNo}`, {
    content,
  });
  return response.data;
};

const FreeComments = ({ eateryNo }) => {
  const [memberNo, setMemberNo] = useState(0);

  useEffect(() => {
    const fetchMemberNo = async () => {
      try {
        const response = await axios.get('http://localhost:8080/main/mypage/members/read', {
          withCredentials: true, // 쿠키를 함께 전송하도록 설정
        });
        setMemberNo(response.data.no);
      } catch (error) {
        console.error('회원정보를 가져오는 데 실패했습니다:', error);
      }
    };

    fetchMemberNo();
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    ['comments', eateryNo],
    ({ pageParam = 0 }) => fetchComments({ pageParam, eateryNo }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.page.number + 1 < lastPage.page.totalPages ? lastPage.page.number + 1 : false;
      },
    }
  );

  const [editingComment, setEditingComment] = useState(null); // 수정 중인 댓글의 ID를 추적
  const [editedContent, setEditedContent] = useState(''); // 수정된 내용 추적
  const [editingReply, setEditingReply] = useState(null); // 수정 중인 대댓글의 ID를 추적
  const [editedReplyContent, setEditedReplyContent] = useState(''); // 수정된 대댓글 내용 추적
  const [replyingToComment, setReplyingToComment] = useState(null); // 대댓글 작성 중인 댓글 추적
  const [newCommentContent, setNewCommentContent] = useState(''); // 새 댓글 내용 추적

  const observerRef = useRef();
  const queryClient = useQueryClient(); // 댓글 업데이트 후 데이터를 새로고침하기 위한 React Query Client

  // 댓글 작성 요청
  const { mutate: addComment } = useMutation(postComment, {
    onSuccess: () => {
      // 댓글 작성 성공 후 댓글 목록 새로고침
      queryClient.invalidateQueries(['comments', eateryNo]);
      setNewCommentContent(''); // 댓글 작성 후 입력창 초기화
    },
  });

  // 댓글 삭제 요청
  const { mutate: removeComment } = useMutation(deleteComment, {
    onSuccess: () => {
      // 댓글 삭제 후 댓글 목록 새로고침
      queryClient.invalidateQueries(['comments', eateryNo]);
    },
  });

  // 댓글 수정 요청
  const { mutate: updateCommentMutate } = useMutation(updateComment, {
    onSuccess: () => {
      // 댓글 수정 후 댓글 목록 새로고침
      queryClient.invalidateQueries(['comments', eateryNo]);
      setEditingComment(null);
      setEditedContent('');
    },
  });

  const lastElementRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const handleEditClick = (comment) => {
    setEditingComment(comment.no);
    setEditedContent(comment.content);
    setReplyingToComment(null);
  };

  const handleSaveClick = async () => {
    if (editedContent.trim()) {
      updateCommentMutate({ commentNo: editingComment, content: editedContent });
    }
  };

  const handleCancelClick = () => {
    setEditingComment(null);
    setEditedContent('');
  };

  const handleReplyClick = (comment) => {
    if (editingComment) {
      setEditingComment(null);
      setEditedContent('');
    }
    setReplyingToComment(replyingToComment === comment.no ? null : comment.no);
  };

  const handleReplySubmit = (comment) => {
    setReplyingToComment(null);
  };

  const handleCommentDelete = (commentNo) => {
    removeComment(commentNo);
  };

  const handleNewCommentSubmit = () => {
    if (newCommentContent.trim()) {
      addComment({ eateryNo, content: newCommentContent, memberNo });
    }
  };

  if (isLoading) return <MySpinner />;

  console.log('memberNo: ', memberNo);

  return (
    <Box w="full" p={4}>
      {/* 새 댓글 작성 */}
      <Flex direction="column" mb={4}>
        <Textarea
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder={memberNo === 0 ? '댓글을 작성하려면 로그인하세요' : '새 댓글을 작성하세요'}
          size="sm"
          rows="4"
          mb="2"
          disabled={memberNo === 0}
        />
        {memberNo !== 0 && (
          <Flex justify="flex-end">
            <Button size="sm" colorScheme="blue" onClick={handleNewCommentSubmit}>
              작성
            </Button>
          </Flex>
        )}
      </Flex>

      {data.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.content.map((comment, index) => {
            const isLastItem = pageIndex === data.pages.length - 1 && index === page.content.length - 1;

            return (
              <Box
                key={comment.no}
                ref={isLastItem ? lastElementRef : null}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                mb={4}
                boxShadow="sm"
              >
                <Flex justify="space-between" mb={2}>
                  <Text fontSize="sm" fontWeight="bold" color="black">
                    {comment.nickname || <>익명</>}
                  </Text>
                  <Flex direction="row" align="center">
                    {comment.updatedAt === comment.createdAt ? null : (
                      <Text fontSize="xx-small" color="black" ml={2}>
                        (수정일: {new Date(comment.updatedAt).toLocaleString()})
                      </Text>
                    )}
                    <Text fontSize="xx-small" color="black" ml={2}>
                      작성일: {new Date(comment.createdAt).toLocaleString()}
                    </Text>
                  </Flex>
                </Flex>

                {editingComment === comment.no ? (
                  <Box>
                    <Textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} size="sm" />
                    <Flex justify="flex-end" mt={2}>
                      <Button size="sm" colorScheme="blue" onClick={handleSaveClick} mr={2}>
                        저장
                      </Button>
                      <Button size="sm" colorScheme="gray" onClick={handleCancelClick}>
                        취소
                      </Button>
                    </Flex>
                  </Box>
                ) : (
                  <Text fontSize="md" color="black" mb={2}>
                    {comment.content}
                  </Text>
                )}

                {/* 댓글 버튼들 */}
                {editingComment !== comment.no && (
                  <Flex justify="flex-end">
                    {memberNo !== 0 && (
                      <Button size="sm" mr={2} onClick={() => handleReplyClick(comment)}>
                        대댓글
                      </Button>
                    )}

                    {memberNo === comment.memberNo && (
                      <Box>
                        <Button size="sm" mr={2} onClick={() => handleEditClick(comment)}>
                          수정
                        </Button>
                        <Button size="sm" colorScheme="red" onClick={() => handleCommentDelete(comment.no)}>
                          삭제
                        </Button>
                      </Box>
                    )}
                  </Flex>
                )}

                {/* 대댓글 작성창 */}
                {replyingToComment === comment.no && (
                  <Box mt={2}>
                    <Textarea placeholder="대댓글을 작성하세요" size="sm" mb={2} />
                    <Flex justify="flex-end">
                      <Button size="sm" colorScheme="blue" onClick={() => handleReplySubmit(comment)} mr={2}>
                        제출
                      </Button>
                      <Button size="sm" colorScheme="gray" onClick={() => setReplyingToComment(null)}>
                        취소
                      </Button>
                    </Flex>
                  </Box>
                )}

                {/* 대댓글 보기 */}
                {comment.childComments && comment.childComments.length > 0 && (
                  <AccordionRoot collapsible variant="plain">
                    <AccordionItem>
                      <AccordionItemTrigger cursor="pointer" w="fit-content">
                        <Text color="black">{comment.childComments.length}개의 대댓글 보기</Text>
                      </AccordionItemTrigger>
                      <AccordionItemContent>
                        {comment.childComments.map((childComment) => (
                          <Box
                            key={childComment.no}
                            p={4}
                            borderWidth="1px"
                            borderRadius="lg"
                            mb={4}
                            ml={6}
                            boxShadow="sm"
                          >
                            <Flex justify="space-between" mb={2}>
                              <Text fontSize="sm" fontWeight="bold" color="black">
                                {childComment.nickname || <>익명</>}
                              </Text>
                              <Flex direction="row" align="center">
                                {childComment.updatedAt === childComment.createdAt ? null : (
                                  <Text fontSize="xx-small" color="black" ml={2}>
                                    (수정일: {new Date(childComment.updatedAt).toLocaleString()})
                                  </Text>
                                )}
                                <Text fontSize="xx-small" color="black" ml={2}>
                                  작성일: {new Date(childComment.createdAt).toLocaleString()}
                                </Text>
                              </Flex>
                            </Flex>

                            {editingReply === childComment.no ? (
                              <Box>
                                <Textarea
                                  value={editedReplyContent}
                                  onChange={(e) => setEditedReplyContent(e.target.value)}
                                  size="sm"
                                />
                                <Flex justify="flex-end" mt={2}>
                                  <Button
                                    size="sm"
                                    colorScheme="blue"
                                    onClick={() =>
                                      updateCommentMutate({ commentNo: editingReply, content: editedReplyContent })
                                    }
                                    mr={2}
                                  >
                                    저장
                                  </Button>
                                  <Button size="sm" colorScheme="gray" onClick={() => setEditingReply(null)}>
                                    취소
                                  </Button>
                                </Flex>
                              </Box>
                            ) : (
                              <Text fontSize="md" color="black" mb={2}>
                                {childComment.content}
                              </Text>
                            )}

                            {/* 대댓글 수정 삭제 버튼 */}
                            {editingReply !== childComment.no && memberNo === childComment.no && (
                              <Flex justify="flex-end">
                                <Button size="sm" mr={2} onClick={() => setEditingReply(childComment.no)}>
                                  수정
                                </Button>
                                <Button
                                  size="sm"
                                  colorScheme="red"
                                  onClick={() => handleCommentDelete(childComment.no)}
                                >
                                  삭제
                                </Button>
                              </Flex>
                            )}
                          </Box>
                        ))}
                      </AccordionItemContent>
                    </AccordionItem>
                  </AccordionRoot>
                )}
              </Box>
            );
          })}
        </div>
      ))}

      {isFetchingNextPage && <MySpinner />}
    </Box>
  );
};

export default FreeComments;
