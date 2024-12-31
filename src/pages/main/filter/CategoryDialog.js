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

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [categoryGroups, setCategoryGroups] = useState([]);

  useEffect(() => {
    axios(`/main/categories/filter/`, {
      method: "GET",
    })
        .then(response => response.data.data)
        .then(data => {
          console.log("category group data : ", data);
          setCategoryGroups(data);
        })
        .catch(err => console.error(err));
  }, [])


  const handleGroupSelect = (value) => {
    setSelectedGroup(value);
    setSelectedCategories([]); // 대분류 선택 시 소분류 초기화
  };

  const handleCategorySelectToggle = (sub) => {
    setSelectedCategories((prev) =>
        prev.includes(sub)
            ? prev.filter((item) => item !== sub) // 선택 해제
            : [...prev, sub] // 선택 추가
    );
  };

  const handleSubmit = () => {
    if (!selectedGroup) {
      console.error("대분류 카테고리를 선택하세요.");
      return;
    }

    // 페이지 초기화 후 요청
    dispatch(setPage(1));

    console.log("소분류 카테고리 : ", selectedCategories);

    // 대분류만 선택하고 소분류는 선택하지 않은 경우
    if (selectedCategories.length === 0) {
      console.log("대분류 : ", selectedGroup);

      axios(`/main/locations/${location.address}/categories/large/${selectedGroup}`, {
        method: "GET",
        params: {
          page: pagination.page,
          size: pagination.size,
        }})
      .then(response => response.data.data)
      .then(data => {
        console.log(data.content);
        dispatch(setEateries(data.content));
      })
      .catch(err => console.error(err));

    // 소분류까지 선택한 경우
    } else {
      console.log("소분류 : ", selectedCategories);

      axios(`/main/locations/${location.address}/categories/small/${selectedCategories}`, {
        method: "GET",
        params: {
          page: pagination.page,
          size: pagination.size,
        }})
      .then(response => response.data.data)
      .then(data => {
        console.log(data.content);
       dispatch(setEateries(data.content));
      })
      .catch(err => console.error(err));
    }
  };

  return (
      <DialogRoot>
        <DialogTrigger asChild>
          <Button variant="outline">
            <MdOutlineRestaurantMenu />
            음식 카테고리
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
              <Button variant="outline">닫기</Button>
            </DialogActionTrigger>
            <DialogActionTrigger>
              <Button onClick={handleSubmit}>적용</Button>
            </DialogActionTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
  );
};

export default CategoryDialog;