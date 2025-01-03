import { useDispatch, useSelector } from "react-redux";
import { MdOutlineRestaurantMenu } from "react-icons/md";

import {
    Box,
    Flex,
    Text,
    Button,
} from "@chakra-ui/react";

import {
    DialogActionTrigger,
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "components/ui/dialog";

import { setCategory } from "../../../redux/slices/filterSlice";
import {useEffect, useState} from "react";
import {setRecommendation} from "../../../redux/slices/eateriesSlice";

const CategoryDialog = () => {
    const dispatch = useDispatch();
    const category = useSelector((state) => state.filter.category);
    const categoryGroups = useSelector((state) => state.filter.categoryGroups); // Redux에서 가져오기

    // 선택된 값 (selected)
    const [selectedCategoryGroup, setSelectedCategoryGroup] = useState(category.group);
    const [selectedCategories, setSelectedCategories] = useState(category.categories);

    // 초기값으로 설정
    useEffect(() => {
        setSelectedCategoryGroup(category.group);
        setSelectedCategories(category.categories);
    }, [category]);

    const handleGroupSelect = (group) => {
        setSelectedCategoryGroup(group);
        setSelectedCategories(null); // 소분류 초기화
    };

    const handleCategorySelect = (cat) => {
        setSelectedCategories(prev =>
            prev && prev.no === cat.no // 기존 선택값과 동일 여부 판단
                ? null // 해제
                : cat // 선택
        );
    };

    const applyChanges = () => {
        dispatch(setRecommendation(false));
        dispatch(
            setCategory({
                group: selectedCategoryGroup,
                categories: selectedCategories,
            })
        );
    };

    const resetChanges = () => {
        setSelectedCategoryGroup(category.group);
        setSelectedCategories(category.categories);
    };

    return (
        <DialogRoot>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <MdOutlineRestaurantMenu style={{ color: '#FF4500' }} />
                    {category.group?.name || "카테고리 선택"}
                    {category.categories?.name && ` > ${category.categories.name}`}
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>음식 카테고리 선택</DialogTitle>
                </DialogHeader>
                <DialogBody pb="4">
                    <Text fontWeight="medium" mb="4">대분류 카테고리</Text>
                    <Flex gap="2" wrap="wrap">
                        {Array.isArray(categoryGroups) && categoryGroups.map((group) => (
                            <Button
                                key={group.no}
                                onClick={() => handleGroupSelect({ no: group.no, name: group.name })}
                                bg={selectedCategoryGroup?.no === group.no ? "orange.600" : "gray.100"}
                                color={selectedCategoryGroup?.no === group.no ? "white" : "black"}
                                borderRadius="full"
                            >
                                {group.name}
                            </Button>
                        ))}
                    </Flex>

                    {selectedCategoryGroup && (
                        <Box mt="6">
                            <Text fontWeight="medium" mb="4">소분류 카테고리</Text>
                            <Flex gap="2" wrap="wrap">
                                {Array.isArray(categoryGroups) && categoryGroups
                                    .find((group) => group.no === selectedCategoryGroup?.no)
                                    ?.categoriesFilterDtos.map((cat) => (
                                        <Button
                                            key={cat.no}
                                            onClick={() => handleCategorySelect({ no: cat.no, name: cat.name })}
                                            bg={selectedCategories?.no === cat.no ? "orange.600" : "gray.100"}
                                            color={selectedCategories?.no === cat.no ? "white" : "black"}
                                            borderRadius="full"
                                        >
                                            {cat.name}
                                        </Button>
                                    ))}
                            </Flex>
                        </Box>
                    )}
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button colorPalette="orange" onClick={applyChanges}>
                            적용
                        </Button>
                    </DialogActionTrigger>
                    <DialogActionTrigger asChild>
                        <Button variant="outline" onClick={resetChanges}>
                            닫기
                        </Button>
                    </DialogActionTrigger>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    );
};

export default CategoryDialog;