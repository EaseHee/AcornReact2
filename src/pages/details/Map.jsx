import React, { useEffect, useRef, useState } from "react";
import { Box, Text } from "@chakra-ui/react";

const Map = ({ latitude, longitude }) => {
  // 지도를 표시할 div 요소의 참조
  const mapContainer = useRef(null);
  // 카카오맵 API 로드 상태를 관리하는 state
  const [kakaoMapsLoaded, setKakaoMapsLoaded] = useState(false);
  // 에러 상태와 메시지를 관리하는 state
  const [error, setError] = useState(false);
  const [formError, setFormError] = useState("");

  // 카카오맵 스크립트 로드 및 초기화
  useEffect(() => {
    const loadKakaoMaps = () => {
      // 이미 로드된 경우 중복 로드 방지
      if (window.kakao && window.kakao.maps) {
        setKakaoMapsLoaded(true);
        return;
      }

      // 카카오맵 스크립트 엘리먼트 생성
      const script = document.createElement("script");
      // autoload=false로 설정하여 수동으로 초기화 제어
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_JAVA_SCRIPT_KEY}&autoload=false`;
      script.async = true;

      // 스크립트 로드 완료 시 실행될 콜백
      script.onload = () => {
        // maps.load()를 호출하여 명시적으로 API 초기화
        window.kakao.maps.load(() => {
          setKakaoMapsLoaded(true);
        });
      };

      // 스크립트 로드 실패 시 에러 처리
      script.onerror = () => {
        setError(true);
        setFormError("카카오맵 스크립트를 불러오는 데 실패했습니다.");
      };

      // DOM에 스크립트 추가
      document.head.appendChild(script);

      // 컴포넌트 언마운트 시 스크립트 제거
      return () => {
        document.head.removeChild(script);
      };
    };

    loadKakaoMaps();
  }, []);

  // 지도 초기화 및 마커 생성
  useEffect(() => {
    // API가 로드되지 않았거나 좌표가 없는 경우 중단
    if (!kakaoMapsLoaded || !latitude || !longitude) {
      if (!latitude || !longitude) {
        setError(true);
        setFormError("유효하지 않은 주소입니다.");
      }
      return;
    }

    try {
      // 지도 옵션 설정
      const options = {
        center: new window.kakao.maps.LatLng(latitude, longitude), // 지도 중심 좌표
        level: 3, // 지도 확대 레벨 (1~14)
        scrollwheel: false, // 스크롤 비활성화
      };

      // 지도 인스턴스 생성
      const map = new window.kakao.maps.Map(mapContainer.current, options);

      // 확대/축소 컨트롤 추가
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      // 마커 위치 설정
      const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);

      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });

      // 지도에 마커 표시
      marker.setMap(map);
    } catch (error) {
      setError(true);
      setFormError("지도를 초기화하는 중에 오류가 발생했습니다.");
    }
  }, [kakaoMapsLoaded, latitude, longitude]);

  // 지도
  return (
    <>
      {error && (
        <Text color="red.500" mb="4">
          {formError}
        </Text>
      )}
      <Box
        ref={mapContainer}
        borderWidth="1px"
        borderRadius="lg"
        width="100%"
        height="300px"
      />
    </>
  );
};

export default Map;
