import {useCallback, useEffect, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "utils/axios";

import {Box, Flex} from "@chakra-ui/react";
import MainCard from "./MainCard.js";
import Filter from "./filter/Filter";
import Swiper from "components/swiper/Swiper.js";
import MySpinner from "components/Spinner.js";

import {useDispatch, useSelector} from "react-redux";
import {
    setCoords,
    setAddress,
    setCategory,
    setLocation,
    setLocationGroups,
    setCategoryGroups
} from "../../redux/slices/filterSlice";
import {setEateries, setPage} from "../../redux/slices/eateriesSlice";


export default function Main() {
    const dispatch = useDispatch();

    const {isLoggedIn} = useSelector(state => state.auth);
    const {eateries, pagination} = useSelector((state) => state.eateries);
    const {category, location} = useSelector((state) => state.filter);

    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    /**
     * 첫 진입 시 사용자 위치 정보를 기반으로 주소 가져오기
     */
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const {latitude, longitude} = position.coords;
                    dispatch(setCoords({lat: latitude, lng: longitude}));

                    try {
                        const data = await (await axios("/main/locations/gps/user", {
                            method: "GET",
                            params: {x: longitude, y: latitude},
                        })).data.data;

                        const address = data.content[0]?.address.split(" ", 2); // ex. "서울 강남구" -> ["서울", "강남구"]
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
    }, []);


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
        if (!location.group || !category.group.no || loading) return;
        setLoading(true);
        // 필터 적용 시 기존 음식점 데이터 초기화
        dispatch(setEateries([]));

        try {
            const data = await fetchData({page: 1, size: 12});
            if (data) {
                setHasMore(data.page.totalPages > 1);
                dispatch(setEateries(data.content));
                dispatch(setPage(1));
            }
        } catch (error) {
            console.error("필터 적용 중 오류:", error);
        } finally {
            setLoading(false);
        }
    }, [dispatch, category, location, loading]);

    /**
     * 다음 페이지 요청 메서드
     */
    const getNext = useCallback(async () => {
        if (!hasMore || loading || !isInitialized) return;
        setLoading(true);
        try {
            const nextPage = pagination.page + 1;
            const data = await fetchData({page: nextPage, size: pagination.size});

            if (!data || data.content.length === 0 || nextPage >= data.page.totalPages) {
                setHasMore(false);
            } else {
                dispatch(setEateries([...eateries, ...data.content]));
                dispatch(setPage(nextPage));
            }
        } catch (error) {
            console.error("다음 페이지 요청 중 오류:", error);
        } finally {
            setLoading(false);
        }
    }, [hasMore, loading, isInitialized, pagination, eateries, dispatch]);


    /**
     * 기본값 설정 후 데이터 로드
     */
    const initializeFilters = useCallback(async () => {
        try {
            // 카테고리 필터 데이터 요청
            const categoryData = await axios.get(`/main/categories/filter`).then((res) => res.data.data);
            dispatch(setCategoryGroups(categoryData)); // 필터 데이터 저장

            // 지역 필터 데이터 요청
            const locationData = await axios.get(`/main/locations/filter`).then((res) => res.data.data);
            dispatch(setLocationGroups(locationData)); // 필터 데이터 저장

            setIsInitialized(true);
            await applyFilters();
        } catch (error) {
            console.error("필터 초기화 중 오류:", error);
        }
    }, [dispatch, category, location, applyFilters]);

    /**
     * 첫 진입 시 필터 기본값 설정
     */
    useEffect(() => {
        if (!isInitialized) {
            initializeFilters();
        }
    }, [initializeFilters, isInitialized]);

    return (
        <Box id="scrollableContainer" height="100vh" overflowY="auto">
            {/* 1행: 상단 메뉴 */}
            <Box position="sticky" top="0" zIndex={10} bg="white" boxShadow="md">
                <Filter applyFilters={applyFilters}/>
            </Box>

            {/* 2행: Swiper */}
            <Box>
                <Swiper/>
            </Box>

            {/* 3행: 음식점 리스트 */}
            <InfiniteScroll
                scrollableTarget="scrollableContainer"
                dataLength={eateries.length}
                next={getNext}
                hasMore={hasMore}
                loader={loading ? <MySpinner alignSelf="center"/> : null} // 로딩 중일 때 표시되는 컴포넌트
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
        </Box>
    );
}