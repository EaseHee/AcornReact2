import { useState, useEffect } from "react";

/**
 * navigator.geolocation : 사용자의 현재 위치를 반환
 *
 * @param defaultCoords : "에이콘아카데미(강남)"
 * @returns 경위도 주소 반환
 */
export function useGeoLocation(
    defaultCoords = {
        lat: 37.498863932227,
        lng: 127.03167064582
    }) {
    // 상태변수로 경위도 주소 관리 - 초기값 설정
    const [coords, setCoords] = useState(defaultCoords);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( // 현재 위치 허용 시 경위도 주소 반환
                (position) =>
                    setCoords({ // 상태 변수에 저장
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    }),
                () => console.log("사용자 위치 정보 조회 차단"),
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
            );
        }
    }, []);

    return coords;
}