import {useEffect, useState} from "react";

import axios from "utils/axios";

import {useDispatch, useSelector} from "react-redux";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import {
  Box,
  Flex,
  Text,
  Button,
} from "@chakra-ui/react";

import { DialogActionTrigger,DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger,} from "../../../components/ui/dialog"
import {setEateries, setPage} from "../../../redux/slices/eateriesSlice";


/**
 * Main으로부터 음식 카테고리에 대한 props를 전달받아서
 * 음식 카테고리를 대분류와 소분류를 구분하여 타원형 버튼으로 선택 후 서버로 요청
 * @returns {CategoryDialog}
 */
const CategoryDialog = () => {
  const location = useSelector(state => state.location);
  const pagination = useSelector(state => state.eateries.pagination);
  const dispatch = useDispatch();

  const [selectedGroup, setSelectedGroup] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [categoryGroups, setCategoryGroups] = useState([]);

  useEffect(() => {
    if (categoryGroups.length > 0) return;
    axios(`/main/categories/filter`, {
      method: "GET",
    })
    .then(response => response.data.data)
    .then(data => {
      console.log("category group data : ", data);
      setCategoryGroups(data);

      // 기본값 설정
      setSelectedCategories([data[0]?.categoriesFilterDtos[0]?.no]);
    })
    .catch(err => console.error(err));
  }, []) // 페이지 첫 렌더 시 1회만 요청 + 상태변수 배열의 길이가 0인 경우에만 실행

  // 대분류 카테고리 선택 시 처리 메서드
  const handleGroupSelect = group => {
    setSelectedGroup(group);
    setSelectedCategories([]); // 대분류 선택 시 소분류 초기화
  };

  // 소분류 카테고리 선택 시 처리 메서드 : 토글 기능 적용
  const handleCategorySelectToggle = category => {
    setSelectedCategories(prev =>
        prev.includes(category) // 소분류 항목 포함 여부에 따른 처리 구분 (토글)
            ? prev.filter(item => item !== category) // 선택 해제
            : [...prev, category] // 선택 추가
    );
  };

  // 적용 버튼 클릭 처리 메서드
  const handleSubmit = () => {
    if (!selectedGroup) { // 대분류 미선택 시 메서드 종료
      console.error("대분류 카테고리를 선택하세요.");
      return;
    }

    let api;
    // 대분류만 선택하고 소분류는 선택하지 않은 경우
    if (selectedCategories.length === 0) {
      api = `/main/locations/${location.address}/categories/large/${selectedGroup}`
      fetchFilteredData(api);
      // 소분류까지 선택한 경우
    } else {
      api = `/main/locations/${location.address}/categories/small/${selectedCategories}`
      fetchFilteredData(api);
    }
  };

  // 필터 조건 서버로 요청 및 데이터 저장
  const fetchFilteredData = async (api) => {
    console.log("API Endpoint:", api); // 확인용 로그
    try {
      const data = (await axios(api, {
        method: "GET",
        params: {page: 1, size: 12},
      })).data.data;
      dispatch(setEateries(data.content)); // 음식점 목록 데이터 redux 상태변수에 저장
    } catch (error) { console.error(error) }
  }


  return (
    <DialogRoot> {/* DialogTrigger 와 Button 모두 button 태그이기 때문에 중첩 오류를 방지하기 위해 asChild props를 설정한다. */}
      <DialogTrigger asChild>
        <Button variant="outline">
          <MdOutlineRestaurantMenu />
          {categoryGroups.find(group => group.no === selectedGroup)?.name}
          {selectedCategories && selectedCategories.length > 0 && (
              <>
                {" > "}
                {categoryGroups
                    ?.map(group =>
                        group.categoriesFilterDtos
                            ?.filter(category => selectedCategories.includes(category.no))
                            ?.map(category => category.name).join(" / "))
                }
              </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>음식 카테고리 선택</DialogTitle>
        </DialogHeader>

        <DialogBody pb="4">
          {/* 대분류 카테고리 */}
          <Text fontWeight="medium" mb="4">
            대분류 카테고리
          </Text>
          <Flex gap="2" wrap="wrap">
            {categoryGroups?.map(group => (
                <Button
                    key={group.no}
                    onClick={() => handleGroupSelect(group.no)}
                    bg={selectedGroup === group.no ? "gray.500" : "gray.100"}
                    color={selectedGroup === group.no ? "white" : "black"}
                    borderRadius="full"
                    px={4}
                    py={2}
                    _hover={{ bg: "gray.500", color: "white" }}
                >
                  {group.name}
                </Button>
            ))}
          </Flex>

          {/* 소분류 카테고리 */}
          {selectedGroup && (
            <Box mt={6}>
              <Text fontWeight="medium" mb="4">
                {categoryGroups
                  .find(group => group.no === selectedGroup)
                  ?.name} 하위 카테고리
              </Text>
              <Flex gap="2" wrap="wrap">
                {categoryGroups
                  .find(group => group.no === selectedGroup)
                  ?.categoriesFilterDtos
                  ?.map(category => (
                      <Button
                          key={category.no}
                          onClick={() => handleCategorySelectToggle(category.no)}
                          bg={
                            selectedCategories.includes(category.no)
                                ? "gray.500"
                                : "gray.100"
                          }
                          color={
                            selectedCategories.includes(category.no) ? "white" : "black"
                          }
                          borderRadius="full"
                          px={4}
                          py={2}
                          _hover={{ bg: "gray.500", color: "white" }}
                      >
                        {category.name}
                      </Button>
                  ))}
              </Flex>
            </Box>
          )}
        </DialogBody>

        <DialogFooter>
        <DialogActionTrigger asChild>
            <Button colorPalette="orange" onClick={handleSubmit}>적용</Button>
          </DialogActionTrigger>
          <DialogActionTrigger asChild>
            <Button variant="outline">닫기</Button>
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>

    </DialogRoot>
  );
};

export default CategoryDialog;