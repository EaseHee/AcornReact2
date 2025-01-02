import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCoords, setLocation } from "../../redux/slices/filterSlice";

const GeoLocationWithKakaoAPI = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAddressFromKakao = async (latitude, longitude) => {
            try {
                const response = await axios.get(
                    "https://dapi.kakao.com/v2/local/geo/coord2address.json",
                    {
                        params: {
                            x: longitude, // 경도
                            y: latitude,  // 위도
                        },
                        headers: {
                            Authorization: `KakaoAK 60ddc85bdd372041c11e1dc97e03d442`, // 카카오 REST API 키
                        },
                    }
                );

                const address = response.data.documents[0]?.address?.address_name;
                console.log("카카오 주소 API 응답:", address);

                if (address) {
                    const addressParts = address.split(" ");
                    dispatch(
                        setLocation({
                            group: addressParts[0], // 예: "서울"
                            locations: addressParts[1], // 예: "강남구"
                        })
                    );
                }
            } catch (error) {
                console.error("카카오 API 요청 실패:", error);
            }
        };

        const getUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log("사용자 좌표:", latitude, longitude);
                        dispatch(setCoords({ lat: latitude, lng: longitude }));
                        fetchAddressFromKakao(latitude, longitude);
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
            }
        };

        getUserLocation();
    }, [dispatch]);

    return null; // 이 컴포넌트는 UI 요소를 렌더링하지 않음
};

export default GeoLocationWithKakaoAPI;