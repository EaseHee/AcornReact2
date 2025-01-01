import React, { useCallback, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "utils/axios";

import { Box, Flex, Text, HStack } from "@chakra-ui/react";
import Maincard from "./MainCard.js";
import Filter from "./filter/Filter";
import Swiper from "../../components/swiper/Swiper.js";
import MySpinner from "../../components/Spinner.js";

import { useDispatch, useSelector } from "react-redux";
import { setLoading, setAddress, setCoords, setError } from "../../redux/slices/locationSlice";
import { setEateries, setPage } from "../../redux/slices/eateriesSlice";

export default function Main() {
  const dispatch = useDispatch();

  // Redux 상태 가져오기
  const location = useSelector((state) => state.location);
  const { eateries, pagination } = useSelector((state) => state.eateries);
  const [hasMore, setHasMore] = React.useState(true);

  /**
   * 사용자 위치 기반 음식점 데이터를 서버로 요청하여 가져오는 함수
   */
  const fetchEateries = useCallback(async () => {
      console.log("fetchEateries page : " , pagination.page);

      console.log("hasMore : ", hasMore);
      if (!hasMore) return;

    try {
      const response = await axios(`/main/locations/${location.address}`, {
        method: "get",
        params: {
          page: pagination.page,
          size: pagination.size,
        },
      });
      const data = response.data.data;

      if (data.content.length === 0 || pagination.page >= data.page.totalPages) {
        setHasMore(false); // 더 이상 데이터가 없는 경우
      }
        console.log("음식점 데이터 조회 성공 : ", data.content);
      dispatch(setEateries([...eateries, ...data.content])); // Redux 상태 업데이트
      dispatch(setPage(pagination.page + 1)); // 페이지 증가
    } catch (error) {
      console.error("음식점 데이터 조회 실패 : ", error);
    }
  }, [dispatch, location.address, pagination.page, pagination.size, eateries]);

  // 페이지 첫 로드 시 화면에 출력할 기본 데이터 요청
  useEffect(() => {
      fetchEateries();
  }, [])

  /**
   * 첫 진입 시 사용자 위치를 기반으로 지역 주소 가져오기
   */
  useEffect(() => {
    if (navigator.geolocation) {
      dispatch(setLoading(true)); // 로딩 시작
      navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            dispatch(setCoords({ latitude, longitude }));

            // 사용자 위치 정보 반환 시 서버에 지역구 음식점 목록 요청
            try {
              const response = await axios("/main/locations/gps/user", {
                method: "get",
                params: {
                  x: longitude,
                  y: latitude,
                  page: pagination.page,
                  size: pagination.size,
                },
              });

              const data = response.data.data;
              const address =
                  `${data.content[0]?.address.split(" ")[0]} ${data.content[0]?.address.split(" ")[1]}`
                  || location.address;

              dispatch(setAddress(address));
              dispatch(setEateries(data.content)); // 초기 데이터 설정
              setHasMore(pagination.page < data.page.totalPages);
            } catch (error) {
              console.error("Error fetching address:", error);
              dispatch(setError("주소 정보를 가져오는 데 실패했습니다."));
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            dispatch(setError("사용자 위치 정보 조회 차단"));
          }
      );
    } else {
      dispatch(setError("Geolocation API가 지원되지 않습니다."));
    }
  }, []);

  return (
      <Box id="scrollableContainer" height="100vh" overflowY="auto">
          {/* 1행: 상단 메뉴 */}
          <Box
              position="sticky"
              top="0"
              zIndex={10}
              bg="white"
              boxShadow="md"
          >
              <Filter />
          </Box>

          {/* 2행: Swiper */}
          <Box>
              <Swiper />
          </Box>

          {/* 3행: 음식점 리스트 */}
          <InfiniteScroll
              dataLength={eateries.length} // 현재까지 로드된 아이템 수
              next={fetchEateries} // 추가 데이터를 요청할 함수
              hasMore={hasMore} // 더 가져올 데이터가 있는지 여부
              loader={<MySpinner />} // 로딩 중일 때 표시할 컴포넌트
              endMessage={<p style={{ textAlign: "center" }}>모든 음식점을 로드했습니다.</p>}
          >
              <Flex justify="space-between" wrap="wrap" gap={4} p={2}>
                  {eateries.map((eatery, index) => (
                      <Box key={index} w="30%" borderRadius="md">
                          <Maincard no={eatery.no} />
                      </Box>
                  ))}
              </Flex>
          </InfiniteScroll>
      </Box>
  );
}