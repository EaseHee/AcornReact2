import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
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
import { BsHandThumbsUp, BsHandThumbsUpFill } from 'react-icons/bs';

// 댓글 데이터 가져오기
const fetchComments = async ({ pageParam = 0, eateryNo }) => {
  const response = await axios.get(`http://localhost:8080/main/eateries/${eateryNo}/comments?page=${pageParam}`);
  return response.data;
};

// 댓글 작성
const postComment = async ({ eateryNo, content, memberNo, parentCommentNo }) => {
  try {
    const response = await axios.post(`http://localhost:8080/main/eateries/comments`, {
      eateryNo,
      content,
      memberNo,
      parentCommentNo, // 대댓글 작성 시 포함
    });
    return response.data;
  } catch (err) {
    console.error(err.message);
  }
};

// 댓글 삭제
const deleteComment = async (commentNo) => {
  const response = await axios.delete(`http://localhost:8080/main/eateries/comments/${commentNo}`);
  return response.data;
};

// 댓글 수정
const updateComment = async ({ commentNo, content }) => {
  try {
    const response = await axios.put(`http://localhost:8080/main/eateries/comments/${commentNo}`, {
      content,
    });
    return response.data;
  } catch (err) {
    console.error(err.message);
  }
};

const fetchLikes = async ({ eateryNo, memberNo }) => {
  const response = await axios.get('http://localhost:8080/main/eateries/comments/likes', {
    params: { eateryNo, memberNo },
  });
  return response.data;
};

// 좋아요 누르기 API 요청
const likeComment = async ({ memberNo, commentNo }) => {
  const response = await axios.post('http://localhost:8080/main/eateries/comments/likes', {
    memberNo,
    commentNo,
  });
  return response.data;
};

// 좋아요 삭제 API 요청
const unlikeComment = async (likeNo) => {
  try {
    const response = await axios.delete(`http://localhost:8080/main/eateries/comments/likes/${likeNo}`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

/**
 * 자유 댓글 컴포넌트
 * @param {int} eateryNo
 * @returns 해당 식당의 댓글을 무한스크롤 처리하여 나열
 */
const FreeComments = ({ eateryNo }) => {
  const [memberNo, setMemberNo] = useState(0);

  useEffect(() => {
    const fetchMemberNo = async () => {
      try {
        const response = await axios.get('http://localhost:8080/main/mypage/members/member-no', {
          withCredentials: true,
        });
        if (response.data) {
          setMemberNo(response.data);
        }
      } catch (err) {
        console.error('사용자 정보 조회 실패:', err);
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
  const [newReplyContent, setNewReplyContent] = useState(''); // 대댓글 입력 상태
  const [likedComments, setLikedComments] = useState([]); // 좋아요를 누른 댓글 추적


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
      setEditingReply(null);
      setEditedReplyContent('');
    },
  });

  // 댓글 좋아요 정보 조회
  const { data: likeData } = useQuery(['likes', eateryNo, memberNo], () => fetchLikes({ eateryNo, memberNo }), {
    onSuccess: (data) => {
      // 좋아요 데이터가 있을 때만 setLikedComments 실행
      if (data && Array.isArray(data)) {
        setLikedComments(data.map((like) => like.commentNo)); // 좋아요를 누른 댓글 ID들
      }
    },
  });

  // 좋아요 누르기
  const { mutate: likeMutate } = useMutation(likeComment, {
    onSuccess: (newLike) => {
      setLikedComments((prev) => [...prev, newLike.commentNo]); // 새로 좋아요를 추가한 댓글 ID
      queryClient.invalidateQueries(['likes', eateryNo, memberNo]);
      queryClient.invalidateQueries(['comments', eateryNo]);
    },
  });

  // 좋아요 삭제
  const { mutate: unlikeMutate } = useMutation(unlikeComment, {
    onSuccess: (likeNo) => {
      setLikedComments((prev) => prev.filter((id) => id !== likeNo)); // 좋아요를 취소한 댓글 ID
      queryClient.invalidateQueries(['likes', eateryNo, memberNo]);
      queryClient.invalidateQueries(['comments', eateryNo]);
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

  const handleReplyEditClick = (childComment) => {
    setEditingReply(childComment.no);
    setEditedReplyContent(childComment.content);
  };

  const handleReplyClick = (comment) => {
    if (editingComment) {
      setEditingComment(null);
      setEditedContent('');
    }
    setReplyingToComment(replyingToComment === comment.no ? null : comment.no);
  };

  const handleReplySubmit = (commentNo) => {
    if (newReplyContent.trim()) {
      addComment({ eateryNo, content: newReplyContent, memberNo, parentCommentNo: commentNo });
      setReplyingToComment(null);
      setNewReplyContent('');
    }
  };

  const handleCommentDelete = (commentNo) => {
    removeComment(commentNo);
  };

  const handleNewCommentSubmit = () => {
    if (newCommentContent.trim()) {
      addComment({ eateryNo, content: newCommentContent, memberNo });
    }
  };

  // 좋아요 누르기
  const handleLikeClick = (commentNo) => {
    if (likedComments.includes(commentNo)) {
      // 좋아요 취소: 이미 좋아요가 눌려있으면 `likeNo`를 찾아서 삭제
      const likeNo = likeData.find((like) => like.commentNo === commentNo)?.no;
      if (likeNo) {
        unlikeMutate(likeNo); // likeNo를 전달
      }
    } else {
      // 좋아요 누르기
      likeMutate({ eateryNo, memberNo, commentNo });
    }
  };

  if (isLoading) return <MySpinner />;

  return (
    <Box w='full' p={4}>
      {/* 새 댓글 작성 */}
      <Flex direction='column' mb={4}>
        <Textarea
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder={memberNo === 0 ? '댓글을 작성하려면 로그인하세요' : '새 댓글을 작성하세요'}
          size="sm"
          rows="4"
          mb="2"
          color="black"
          disabled={memberNo === 0}
        />
        {memberNo !== 0 && (
          <Flex justify="end">
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
                borderWidth='1px'
                borderRadius='lg'
                mb={4}
                boxShadow="sm"
                bg={comment.deleted ? 'gray.300' : 'white'}
              >
                <Flex justify='space-between' mb={2}>
                  <Text fontSize='sm' fontWeight='bold' color='black'>
                    {comment.nickname || <>익명</>}
                  </Text>
                  <Flex direction='row' align='center'>
                    {comment.updatedAt === comment.createdAt ? null : (
                      <Text fontSize='sm' color='black' ml={2}>
                        (수정일: {new Date(comment.updatedAt).toLocaleString()})
                      </Text>
                    )}
                    <Text fontSize='sm' color='black' ml={2}>
                      작성일: {new Date(comment.createdAt).toLocaleString()}
                    </Text>
                  </Flex>
                </Flex>

                {editingComment === comment.no ? (
                  <Box>
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      size="sm"
                      color="black"
                      rows={4}
                    />
                    <Flex justify="end" mt={2}>
                      <Button size="sm" colorScheme="blue" onClick={handleSaveClick} mr={2}>
                        저장
                      </Button>
                      <Button size='sm' onClick={handleCancelClick}>
                        취소
                      </Button>
                    </Flex>
                  </Box>
                ) : (
                  <Text fontSize='md' color='black' mb={2}>
                    {comment.content}
                  </Text>
                )}

                {/* 댓글 버튼들 */}
                {editingComment !== comment.no && (
                  <Flex justify="end">
                    {memberNo !== 0 && (
                      <Flex align="center">
                        {/* 좋아요 아이콘 */}
                        {!comment.deleted && (
                          <Flex justify="end" align="center">
                            {likedComments.includes(comment.no) ? (
                              <BsHandThumbsUpFill cursor="pointer" size={25} onClick={() => handleLikeClick(comment.no)} />
                            ) : (
                              <BsHandThumbsUp cursor="pointer" size={25} onClick={() => handleLikeClick(comment.no)} />
                            )}
                            <Text ml={2}>{comment.likeCount}</Text>
                          </Flex>
                        )}
                        <Button size="sm" mx={2} onClick={() => handleReplyClick(comment)}>
                          대댓글 달기
                        </Button>
                      </Flex>
                    )}

                    {memberNo === comment.memberNo && !comment.deleted && (
                      <Box>
                        <Button colorPalette="orange" size='sm' mr={2} onClick={() => handleEditClick(comment)}>
                          수정
                        </Button>
                        <Button colorPalette="orange" size='sm' colorScheme='red' onClick={() => handleCommentDelete(comment.no)}>
                          삭제
                        </Button>
                      </Box>
                    )}
                  </Flex>
                )}

                {/* 대댓글 작성창 */}
                {replyingToComment === comment.no && (
                  <Box mt={2}>
                    <Textarea
                      placeholder="대댓글을 작성하세요"
                      size="sm"
                      mb={2}
                      color="black"
                      value={newReplyContent}
                      onChange={(e) => setNewReplyContent(e.target.value)}
                      rows={4}
                    />
                    <Flex justify="end">
                      <Button size="sm" colorScheme="blue" onClick={() => handleReplySubmit(comment.no)} mr={2}>
                        작성
                      </Button>
                      <Button size='sm' variant="outline" onClick={() => setReplyingToComment(null)}>
                        취소
                      </Button>
                    </Flex>
                  </Box>
                )}

                {/* 대댓글 보기 */}
                {comment.childComments && comment.childComments.length > 0 && (
                  <AccordionRoot collapsible variant="plain" defaultValue={['b']}>
                    <AccordionItem>
                      <AccordionItemTrigger cursor="pointer" w="fit-content">
                        <Button variant="outline">{comment.childComments.length}개의 대댓글</Button>
                      </AccordionItemTrigger>
                      <AccordionItemContent>
                        {comment.childComments.map((childComment) => (
                          <Box
                            key={childComment.no}
                            p={4}
                            borderWidth='1px'
                            borderRadius='lg'
                            mb={4}
                            ml={6}
                            boxShadow="sm"
                            bg="white"
                          >
                            <Flex justify='space-between' mb={2}>
                              <Text fontSize='sm' fontWeight='bold' color='black'>
                                {childComment.nickname || <>익명</>}
                              </Text>
                              <Flex direction='row' align='center'>
                                {childComment.updatedAt === childComment.createdAt ? null : (
                                  <Text fontSize='sm' color='black' ml={2}>
                                    (수정일: {new Date(childComment.updatedAt).toLocaleString()})
                                  </Text>
                                )}
                                <Text fontSize='sm' color='black' ml={2}>
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
                                  color="black"
                                  rows={4}
                                />
                                <Flex justify="end" mt={2}>
                                  <Button
                                    size="sm"
                                    colorScheme="blue"
                                    onClick={() => updateCommentMutate({ commentNo: editingReply, content: editedReplyContent })}
                                    mr={2}
                                  >
                                    저장
                                  </Button>
                                  <Button size='sm' variant="outline" onClick={() => setEditingReply(null)}>
                                    취소
                                  </Button>
                                </Flex>
                              </Box>
                            ) : (
                              <Text fontSize='md' color='black' mb={2}>
                                {childComment.content}
                              </Text>
                            )}

                            {/* 대댓글 수정 삭제 버튼 */}
                            {editingReply !== childComment.no && (
                              <Flex justify="end">
                                {memberNo === 0 ? (
                                  // 회원 로그인을 하지 않은 경우
                                  <Flex justify="end" align="center">
                                    <BsHandThumbsUp size={25} />
                                    <Text ml={2}>{comment.likeCount}</Text>
                                  </Flex>
                                ) : memberNo === childComment.memberNo ? (
                                  // 회원 로그인을 했고, 작성자인 경우
                                  <Flex justify="end" align="center">
                                    {likedComments.includes(childComment.no) ? (
                                      <BsHandThumbsUpFill
                                        cursor="pointer"
                                        size={25}
                                        onClick={() => handleLikeClick(childComment.no)}
                                      />
                                    ) : (
                                      <BsHandThumbsUp
                                        cursor="pointer"
                                        size={25}
                                        onClick={() => handleLikeClick(childComment.no)}
                                      />
                                    )}
                                    <Text ml={2}>{childComment.likeCount}</Text>
                                    <Button size="sm" mr={2} onClick={() => handleReplyEditClick(childComment)}>
                                      수정
                                    </Button>
                                    <Button size="sm" colorScheme="red" onClick={() => handleCommentDelete(childComment.no)}>
                                      삭제
                                    </Button>
                                  </Flex>
                                ) : (
                                  // 회원 로그인을 했고, 작성자가 아닌 경우
                                  <Flex justify="end" align="center">
                                    {likedComments.includes(childComment.no) ? (
                                      <BsHandThumbsUpFill
                                        cursor="pointer"
                                        size={25}
                                        onClick={() => handleLikeClick(childComment.no)}
                                      />
                                    ) : (
                                      <BsHandThumbsUp
                                        cursor="pointer"
                                        size={25}
                                        onClick={() => handleLikeClick(childComment.no)}
                                      />
                                    )}
                                    <Text ml={2}>{childComment.likeCount}</Text>
                                  </Flex>
                                )}
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
