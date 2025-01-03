import {useCallback, useEffect, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";


import {Box, Flex} from "@chakra-ui/react";

import Swiper from "components/swiper/Swiper.js";
import MySpinner from "components/Spinner.js";

import axios from "utils/axios";

import MainCard from "./MainCard.js";
import Filter from "./filter/Filter";
import NoDataComponent from "./NoDataComponent";

import {useDispatch, useSelector} from "react-redux";
import {
    setLocationGroups,
    setCategoryGroups
} from "../../redux/slices/filterSlice";
import {setEateries, setPage} from "../../redux/slices/eateriesSlice";
import GeoLocationWithKakaoAPI from "./GeoLocationWithKakaoAPI";

export default function Main() {
    const dispatch = useDispatch();

    // 사용자의 로그인 정보, 음식점 목록 정보, 필터 정보를 저장, 관리하고 있는 redux 상태 변수
    const {isLoggedIn} = useSelector(state => state.auth);
    const {eateries, pagination} = useSelector((state) => state.eateries);
    const {category, location} = useSelector((state) => state.filter);

    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    /**
     * 음식점 데이터를 서버에 요청하는 메서드
     * 로그인 여부에 따라 요청 API 구분 - 추천 알고리즘 적용 여부
     *
     * @param { page, size } : 페이지 번호, 데이터 개수 요청
     * redux store에 저장된 필터 데이터를 기준으로 서버에 요청
     */
    const fetchData = async ({page, size}) => {
        let api;

        // 필터 조건이 있는 경우 우선 적용
        if (category?.group?.no && location?.group) {
            const locationParam = location.locations
                ? `${location.group} ${location.locations}`
                : location.group;

            const categoryParam = category.categories?.no
                ? `categories/small/${category.categories.no}`
                : `categories/large/${category.group.no}`;

            api = `/main/locations/${locationParam}/${categoryParam}`;
        }
        // 필터 조건이 없고 로그인 상태인 경우 사용자 추천 API 호출
        else if (isLoggedIn) {
            api = `/main/members/eateries/recommends`;
        }

        console.log("[fetchData] API : ", api);

        try {
            return await axios.get(api, {params: {page, size}})
                .then(res => res.data.data)
        } catch (error) {
            console.error("데이터 요청 중 오류:", error);
            return null;
        }
    };

    /**
     * 필터 조건 적용 메서드
     */
    const applyFilters = useCallback(async () => {
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
        } catch (error) {
            console.error("필터 적용 중 오류:", error);
        } finally {
            setLoading(false);
        }
    }, [isInitialized, fetchData, category, location]);


    /**
     * 다음 페이지 요청 메서드
     */
    const getNext = async () => {
        if (!hasMore || loading) return;

        setLoading(true);
        try {
            const nextPage = pagination.page + 1;
            const data = await fetchData({ page: nextPage, size: pagination.size });
            if (data) {
                dispatch(setEateries([...eateries, ...data.content]));
                dispatch(setPage(nextPage));
                setHasMore(data.page.totalPages > nextPage);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("다음 페이지 요청 중 오류:", error);
        } finally {
            setLoading(false);
        }
    };


    /**
     * 기본값 설정 후 데이터 로드
     * Promise.allSettled([]) :   Promise 객체를 모두 처리하되 실패도 포함한다.
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
        } catch (error) {
            console.error("필터 초기화 중 오류:", error);
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
    }, [isInitialized, category, location]);


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
            {eateries.length === 0 && !loading ? (
                <NoDataComponent applyFilters={applyFilters} />
            ) : (
            <InfiniteScroll
                scrollableTarget="scrollableContainer"
                dataLength={eateries.length}
                next={getNext}
                hasMore={hasMore}
                loader={loading && <MySpinner alignSelf="center"/>} // 로딩 중일 때 표시되는 컴포넌트
                endMessage={<p style={{textAlign: "center"}}>모든 음식점을 로드했습니다.</p>}
            >
                <Flex justify="space-between" wrap="wrap" gap={4} p={2}>
                    {eateries.map((eatery, index) => (
                        <Box key={index} w={{base: "100%", sm: "48%", md: "30%", lg: "30%"}} borderRadius="md">
                            <MainCard data={eatery}/>
                        </Box>
                    ))}
                </Flex>
            </InfiniteScroll>
            )}
        </Box>
    );
}