import {useEffect, useState} from "react";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import {
  Box,
  Flex,
  Text,
  Button,
  DialogCloseTrigger,
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@chakra-ui/react";

import axios from "axios";

/**
 * Main으로부터 음식 카테고리에 대한 props를 전달받아서
 * 음식 카테고리를 대분류와 소분류를 구분하여 타원형 버튼으로 선택 후 서버로 요청
 * @returns {CategoryDialog}
 */
const CategoryDialog = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [categoryGroups, setCategoryGroups] = useState([]);

  useEffect(() => {
    axios("http://localhost:8080/main/filter", {method: "GET"})
        .then(response => response.data)
        .then(data => setCategoryGroups(data))
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

  const handleSubmit = async () => {
    if (!selectedCategories || selectedCategories.length === 0) {
      console.log(selectedGroup);
    }
    console.log(selectedCategories);

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
              {categoryGroups.map(group => (
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
                    {categoryGroups[selectedGroup -1].name} 하위 카테고리
                  </Text>
                  <Flex gap="2" wrap="wrap">
                    {categoryGroups
                        .find(group => group.no === selectedGroup)
                        ?.categories.map(category => (
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
          <DialogActionTrigger onClick={handleSubmit}>
              <Button colorPalette="orange">적용</Button>
            </DialogActionTrigger>
            <DialogCloseTrigger asChild>
              <Button variant="outline">닫기</Button>
            </DialogCloseTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
  );
};

export default CategoryDialog;