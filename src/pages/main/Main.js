import {useCallback, useEffect, useState} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";

import {Box, Button, Flex, Text} from "@chakra-ui/react";

import Swiper from "components/swiper/Swiper.js";
import MySpinner from "components/Spinner.js";

import axios from "utils/axios";

import MainCard from "./MainCard.js";
import Filter from "./filter/Filter";
import NoDataComponent from "./NoDataComponent";
import GeoLocationWithKakaoAPI from "./GeoLocationWithKakaoAPI";

import {
    setLocationGroups,
    setCategoryGroups, resetFilter
} from "../../redux/slices/filterSlice";
import {setEateries, setPage} from "../../redux/slices/eateriesSlice";


/**
 * [ 메인 화면 컴포넌트 ]
 * - 사용자의 로그인 여부와 관계없이 이용가능하며
 *   로그인 회원에게는 음식점 추천 기능을 제공
 * - 모든 사용자에게 음식 카테고리, 지역 카테고리를 선택할 수 있는 필터링 기능 제공
 * - 사용자의 실시간 위치를 제공받는 GeoLocation 라이브러리 활용
 * -
 * @returns {JSX.Element}
 * @constructor
 */
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
     * 로그인 여부에 따라 요청 API 구분 - 추천 받기 버튼 클릭 가능 여부
     *
     * @param { page, size } : 페이지 번호, 데이터 개수 요청
     * Redux store에 저장된 필터 데이터를 기준으로 API를 구분하여 서버에 요청
     *
     * [의존성 배열] : 사용자의 로그인 여부, 각 필터 조건의 변경에 따라 메서드 재생성
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
            setError(true);
            console.error("데이터 요청 중 오류:", e);
        }
    }, [isLoggedIn, category, location]);

    /**
     * 필터 조건 적용 메서드
     * 음식, 지역 카테고리의 선택 데이터가 변경되면 호출
     * 각 필터의 조건에 해당하는 요청 변수를 서버에 전달
     * -> 반환 데이터
     *      : 음식점 목록, 페이지 번호 Redux 상태로 관리
     *      + 무한 스크롤 요청 시 hasMore 라는 로컬 상태변수로 서버 요청 여부를 결정
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
     * <InfiniteScroll> 페이징 처리
     *  : 다음 페이지 요청 메서드
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
            setError(true);
            console.error("다음 페이지 요청 중 오류:", e);
        } finally {
            setLoading(false);
        }
    };


    /**
     * 필터 조건에 출력될 데이터 서버로 요청
     * Promise.all([]) :   Promise 객체를 모두 처리
     * - 음식 카테고리와 지역 카테고리 정보 각각 요청
     * [의존성 배열] :
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
            setError(true);
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


    // 오류 메시지 출력 JSX
    const ErrorState = ({formError, resetHandler}) => (
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
                        loader={<MySpinner alignSelf="center"/>}
                        endMessage={<p style={{textAlign: "center"}}>마지막 목록입니다.</p>}
                    >
                        <Flex justify="space-between" wrap="wrap" gap={4} p={2}>
                            {eateries.map((eatery, index) => (
                                <Box
                                    key={index}
                                    w={{base: "100%", sm: "48%", md: "30%", lg: "30%"}}
                                    borderRadius="md"
                                >
                                    <MainCard data={eatery}/>
                                </Box>
                            ))}
                        </Flex>
                    </InfiniteScroll>
                ) : error ? (
                    <ErrorState
                        formError={formError}
                        resetHandler={() => {
                            setError(false);
                            dispatch(resetFilter());
                        }}
                    />
                ) : loading ? (
                    <MySpinner alignSelf="center"/>
                ) : (
                    <NoDataComponent/>
                )
            }
        </Box>
    );
}