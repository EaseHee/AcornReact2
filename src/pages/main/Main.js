import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "utils/axios";

import { Box, Flex } from "@chakra-ui/react";
import MainCard from "./MainCard.js";
import Filter from "./filter/Filter";
import Swiper from "components/swiper/Swiper.js";
import MySpinner from "components/Spinner.js";

import { useDispatch, useSelector } from "react-redux";
import {
    setCoords,
    setAddress,
    setCategory,
    setLocation,
    setLocationGroups,
    setCategoryGroups
} from "../../redux/slices/filterSlice";
import { setEateries, setPage } from "../../redux/slices/eateriesSlice";

export default function Main() {
    const dispatch = useDispatch();

    // Redux 상태 가져오기
    const { eateries, pagination } = useSelector((state) => state.eateries);
    const { category, location } = useSelector((state) => state.filter);

    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    /**
     * 첫 진입 시 사용자 위치 정보를 기반으로 주소 가져오기
     */
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    dispatch(setCoords({ lat: latitude, lng: longitude }));

                    try {
                        console.log("GPS (x : ", longitude, ", y : ", latitude, ")");
                        const data = await (await axios("/main/locations/gps/user", {
                                method: "GET",
                                params: { x: longitude, y: latitude },
                            })).data.data;

                        const address = data.content[0]?.address.split(" ", 2); // ex. "서울 강남구" -> ["서울", "강남구"]
                        console.log(address);
                        if (address) {
                            dispatch(
                                setLocation({
                                    group: address[0],
                                    locations: address[1],
                                })
                            );
                        }
                    } catch (error) {
                        console.error("사용자 위치 기반 데이터 조회 실패:", error);
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                }
            );
        }
    }, [dispatch]);

    /**
     * 음식점 데이터를 서버에 요청하는 메서드
     * redux store에 저장된 필터 데이터를 기준으로 서버에 요청
     */
    const applyFilters = useCallback(async () => {
        if (!location.group || !category.group.no) return;

        setLoading(true);
        const categoryParam = category.categories?.no
            ? `categories/small/${category.categories.no}`
            : `categories/large/${category.group.no}`;
        const api = `/main/locations/${location.group} ${location.locations}/${categoryParam}`;

        try {
            const data = await (await axios(api, {
                method: "GET",
                params: { page: 1, size: 12 },
            })).data.data;

            setHasMore(data.page.totalPages > 1);
            dispatch(setEateries(data.content));
            dispatch(setPage(1)); // 초기 페이지로 설정
        } catch (error) {
            console.error("필터 적용 중 오류:", error);
        } finally {
            setLoading(false);
        }
    }, [dispatch, location, category]);


    /**
     * 기본값 설정 후 데이터 로드
     */
    const initializeFilters = useCallback(async () => {
        try {
            // 카테고리 필터 데이터 요청 및 기본 카테고리 값 정의
            const categoryData = await (await axios.get(`/main/categories/filter`)).data.data;

            // 카테고리 데이터 Redux에 저장
            dispatch(setCategoryGroups(categoryData));

            // 카테고리 기본값 설정
            if (!category.group.no && !category.categories.no) {
                dispatch(
                    setCategory({
                        group: {
                            no: categoryData[0]?.no,
                            name: categoryData[0]?.name
                        }
                    })
                );
            }

            // 지역 필터 데이터 요청 및 기본 필터값 정의
            const locationData = await(await axios.get(`/main/locations/filter`)).data.data;

            // 지역 데이터 Redux에 저장
            dispatch(setLocationGroups(locationData));

            // 지역 기본값 설정
            if (!location.group && !location.locations) {
                dispatch(
                    setLocation({
                        group: locationData[0]?.name,
                        locations: locationData[0]?.locationsFilterDtos[0]?.name,
                    })
                );
            }

            // 필터 조건에 맞게 데이터 조회
            applyFilters();
        } catch (error) {
            console.error("필터 기본값 설정 중 오류:", error);
        }
    }, [dispatch, applyFilters, category, location]);



    /**
     * 첫 진입 시 필터 기본값 설정
     */
    useEffect(() => {
        initializeFilters();
    }, [initializeFilters]);

    /**
     * 다음 페이지 요청 메서드
     */
    const getNext = async () => {
        if (!hasMore || loading) return;

        setLoading(true);
        const categoryParam = category.categories?.no
            ? `categories/small/${category.categories.no}`
            : `categories/large/${category.group.no}`;
        const api = `/main/locations/${location.group} ${location.locations}/${categoryParam}`;

        try {
            const data = await (await axios(api, {
                method: "GET",
                params: { page: pagination.page, size: pagination.size },
            })).data.data;

            if (data.content.length === 0 || pagination.page >= data.page.totalPages) {
                setHasMore(false);
            } else {
                dispatch(setEateries([...eateries, ...data.content]));
                dispatch(setPage(pagination.page + 1));
            }
        } catch (error) {
            console.error("다음 페이지 요청 중 오류:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box id="scrollableContainer" height="100vh" overflowY="auto">
            {/* 1행: 상단 메뉴 */}
            <Box position="sticky" top="0" zIndex={10} bg="white" boxShadow="md">
                <Filter applyFilters={applyFilters} />
            </Box>

            {/* 2행: Swiper */}
            <Box>
                <Swiper />
            </Box>

            {/* 3행: 음식점 리스트 */}
            <InfiniteScroll
                dataLength={eateries.length}
                next={getNext}
                hasMore={hasMore}
                loader={<MySpinner />}
                endMessage={<p style={{ textAlign: "center" }}>모든 음식점을 로드했습니다.</p>}
            >
                <Flex justify="space-between" wrap="wrap" gap={4} p={2}>
                    {eateries.map((eatery, index) => (
                        <Box key={index} w="30%" borderRadius="md">
                            <MainCard data={eatery} />
                        </Box>
                    ))}
                </Flex>
            </InfiniteScroll>
        </Box>
    );
}