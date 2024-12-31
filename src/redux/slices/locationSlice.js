// src/redux/slices/locationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
    name: "location",
    initialState: {
        coords: {
            lat: "37.498863932227",
            lng: "127.03167064582",
        }, // 사용자 경위도 주소 초기값
        address: "강남구", // 사용자 지역구 주소
        loading: false, // 위치 로드 상태
        error: null, // 에러 상태 추가
    },
    reducers: {
        setCoords(state, action) {
            const { latitude, longitude } = action.payload;
            state.coords.lat = latitude;
            state.coords.lng = longitude;
            state.loading = true; // 경위도 주소 반환 시 로딩 설정
            state.error = null;
        },
        setAddress(state, action) {
            state.address = action.payload;
            state.loading = false; // 주소 업데이트 후 로딩 해제
            state.error = null;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
            state.loading = false; // 에러 발생 시 로딩 해제
        },
    },
});

export const { setCoords, setAddress, setLoading, setError } =
    locationSlice.actions;

export default locationSlice.reducer;