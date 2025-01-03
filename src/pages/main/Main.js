import {useCallback, useEffect, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";


import {Box, Button, Flex, Text} from "@chakra-ui/react";

import Swiper from "components/swiper/Swiper.js";
import MySpinner from "components/Spinner.js";

import axios from "utils/axios";

import MainCard from "./MainCard.js";
import Filter from "./filter/Filter";
import NoDataComponent from "./NoDataComponent";

import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {
    setLocationGroups,
    setCategoryGroups, resetFilter
} from "../../redux/slices/filterSlice";
import {setEateries, setPage, setRecommendation} from "../../redux/slices/eateriesSlice";
import GeoLocationWithKakaoAPI from "./GeoLocationWithKakaoAPI";


export default function Main() {
    const dispatch = useDispatch();

    // 사용자의 로그인 정보, 음식점 목록 정보, 필터 정보를 저장, 관리하고 있는 redux 상태 변수
    const {isLoggedIn} = useSelector(state => state.auth);
    const {pagination, isRecommended} = useSelector((state) => state.eateries);
    const eateries = useSelector((state) => state.eateries.eateries, shallowEqual);
    const {category, location} = useSelector((state) => state.filter);

    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    // 오류 처리용 상태 변수
    const [error, setError] = useState(false);
    const [formError, setFormError] = useState("");

    /**
     * 음식점 데이터를 서버에 요청하는 메서드
     * 로그인 여부에 따라 요청 API 구분 - 추천 알고리즘 적용 여부
     *
     * @param { page, size } : 페이지 번호, 데이터 개수 요청
     * redux store에 저장된 필터 데이터를 기준으로 서버에 요청
     */
    const fetchData = useCallback(async ({page, size}) => {
        let api;
        if (category?.group?.no && location?.group) {
            const locationParam = location.locations
                ? `${location.group} ${location.locations}`
                : location.group;
            const categoryParam = category.categories?.no
                ? `categories/small/${category.categories.no}`
                : `categories/large/${category.group.no}`;
            api = `/main/locations/${locationParam}/${categoryParam}`;
        } else if (isLoggedIn) {
            api = `/main/members/eateries/recommends`;
        }
        try {
            return await axios.get(api, {params: {page, size}}).then((res) => res.data.data);
        } catch (e) {
            setFormError("음식점 목록을 불러오는데 실패하였습니다.")
            console.error("데이터 요청 중 오류:", e);
        }
    }, [isLoggedIn, category, location]);

    /**
     * 필터 조건 적용 메서드
     */
    const applyFilters = useCallback(async () => {
        if (isRecommended) return;

        if (!location?.group || !category?.group?.no || loading) return;
        setLoading(true);
        // 필터 적용 시 기존 음식점 데이터 초기화
        dispatch(setEateries([]));
        console.log("===== Apply Filter 호출 =====");
        try {
            const data = await fetchData({page: 1, size: 12});
            if (data) {
                dispatch(setEateries(data.content));
                dispatch(setPage(1));
                setHasMore(data.page.totalPages > 1);
            } else {
                setHasMore(false);
            }
        } catch (e) {
            setFormError("음식점 목록을 불러오는데 실패하였습니다.");
            console.error("필터 적용 중 오류:", e);
        } finally {
            setLoading(false);
        }
    }, [isRecommended, fetchData, category, location, loading]);


    /**
     * 다음 페이지 요청 메서드
     */
    const getNext = async () => {
        if (!hasMore || loading) return;

        setLoading(true);
        try {
            const nextPage = pagination.page + 1;
            let data;

            if (isRecommended) {
                // 추천 상태인 경우 추천 API 호출
                data = await axios.get(`/main/members/eateries/recommends`, {
                    params: {
                        page: nextPage,
                        size: pagination.size
                    }
                }).then(res => res.data.data);
            } else {
                // 일반 필터 조건에 따른 데이터 호출
                data = await fetchData({page: nextPage, size: pagination.size});
            }
            if (data) {
                dispatch(setEateries([...eateries, ...data.content]));
                dispatch(setPage(nextPage));
                setHasMore(data.page.totalPages > nextPage);
            } else {
                setHasMore(false);
            }
        } catch (e) {
            setFormError("다음 페이지를 불러오는데 실패하였습니다.");
            console.error("다음 페이지 요청 중 오류:", e);
        } finally {
            setLoading(false);
        }
    };


    /**
     * 기본값 설정 후 데이터 로드
     * Promise.all([]) :   Promise 객체를 모두 처리
     */
    const initializeFilters = useCallback(async () => {
        try {
            // 기본 필터 데이터 요청
            const [categoryData, locationData]
                = await Promise.all([
                axios.get(`/main/categories/filter`).then((res) => res.data.data),
                axios.get(`/main/locations/filter`).then((res) => res.data.data),
            ]);
            dispatch(setCategoryGroups(categoryData));
            dispatch(setLocationGroups(locationData));

            setIsInitialized(true);
        } catch (e) {
            setFormError("검색 필터 조건을 불러오는 데 실패하였습니다.");
            console.error("필터 초기화 오류:", e);
        } finally {
            setLoading(false);
        }
    }, [dispatch, applyFilters]);

    /**
     * 첫 진입 시 필터 기본값 설정
     */
    useEffect(() => {
        if (!isInitialized) {
            initializeFilters();
        } else {
            applyFilters();
        }
    }, [isInitialized, isRecommended, category, location]);


    // 오류 상태 JSX
    const ErrorState = ({ formError, resetHandler }) => (
        <Flex justify="center" align="center" flexDirection="column">
            <Text color="red.500" fontSize="lg" mb={4}>
                {formError || "알 수 없는 오류가 발생했습니다."}
            </Text>
            <Button onClick={resetHandler} colorScheme="orange">
                다시 시도하기
            </Button>
        </Flex>
    );

    return (
        <Box id="scrollableContainer" height="100vh" overflowY="auto">
            <GeoLocationWithKakaoAPI/>

            {/* 1행: 상단 메뉴 */}
            <Box position="sticky" top="0" zIndex={10} bg="white" boxShadow="md">
                <Filter/>
            </Box>

            {/* 2행: Swiper */}
            <Box>
                <Swiper/>
            </Box>

            {/* 3행: 음식점 리스트 */}
            {/* 데이터 표시 */}
            {
                eateries.length ? (
                    <InfiniteScroll
                        scrollableTarget="scrollableContainer"
                        dataLength={eateries.length}
                        next={getNext}
                        hasMore={hasMore}
                        loader={<MySpinner alignSelf="center" />}
                        endMessage={<p style={{ textAlign: "center" }}>마지막 목록입니다.</p>}
                    >
                        <Flex justify="space-between" wrap="wrap" gap={4} p={2}>
                            {eateries.map((eatery, index) => (
                                <Box
                                    key={index}
                                    w={{ base: "100%", sm: "48%", md: "30%", lg: "30%" }}
                                    borderRadius="md"
                                >
                                    <MainCard data={eatery} />
                                </Box>
                            ))}
                        </Flex>
                    </InfiniteScroll>
                ) : error ? (
                    <ErrorState
                        formError={formError}
                        resetHandler={() => dispatch(resetFilter())}
                    />
                ) : loading ? (
                    <MySpinner alignSelf="center" />
                ) : (
                    <NoDataComponent />
                )
            }
        </Box>
    );
}