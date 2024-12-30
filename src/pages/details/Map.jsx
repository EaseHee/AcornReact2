import React, { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";

/**
 * 카카오 지도를 표시하는 React 컴포넌트
 * @param {number} latitude - 위도
 * @param {number} longitude - 경도
 * @param {string} name - 장소 이름 (현재 미사용)
 */
const Map = ({ latitude, longitude, name }) => {
  // 지도를 표시할 div 요소의 참조
  const mapContainer = useRef(null);
  // 카카오맵 API 로드 상태를 관리하는 state
  const [kakaoMapsLoaded, setKakaoMapsLoaded] = useState(false);

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
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=378972c56faff9a433209f6d133d4945&autoload=false`;
      script.async = true;

      // 스크립트 로드 완료 시 실행될 콜백
      script.onload = () => {
        // maps.load()를 호출하여 명시적으로 API 초기화
        window.kakao.maps.load(() => {
          console.log("Kakao maps script loaded successfully.");
          setKakaoMapsLoaded(true);
        });
      };

      // 스크립트 로드 실패 시 에러 처리
      script.onerror = () => {
        console.error("Failed to load Kakao Maps script.");
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
    if (!kakaoMapsLoaded || !window.kakao || !window.kakao.maps || !latitude || !longitude) {
      console.log("Waiting for Kakao Maps to load...");
      return;
    }

    try {
      // 지도 옵션 설정
      const options = {
        center: new window.kakao.maps.LatLng(latitude, longitude), // 지도 중심 좌표
        level: 3, // 지도 확대 레벨 (1~14)
        draggable: false, // 드래그 비활성화 (by @EaseHee)
        scrollwheel: false, // 스크롤 비활성화 (by @EaseHee)
      };

      // 지도 인스턴스 생성
      const map = new window.kakao.maps.Map(mapContainer.current, options);
      
      // 마커 위치 설정
      const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });

      // 지도에 마커 표시
      marker.setMap(map);
    } catch (error) {
      console.error("Error initializing Kakao map:", error);
    }
  }, [kakaoMapsLoaded, latitude, longitude]);

  // 지도를 담을 컨테이너 렌더링
  return (
    <Box
      ref={mapContainer}
      borderWidth="1px"
      borderRadius="lg"
      width="100%"
      height="300px"
    />
  );
};

export default Map;