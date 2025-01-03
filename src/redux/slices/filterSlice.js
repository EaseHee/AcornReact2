import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
    name: "filter",
    initialState: {
        category: {
            group: { no: 1, name: "한식" }, // 대분류
            categories: { no: null, name: null }, // 소분류
        },
        categoryGroups: [], // 카테고리 그룹 데이터
        location: {
            group: "서울", // 대분류 (지역 대분류 이름)
            locations: "강남구", // 소분류 (지역 소분류 이름)
            coords: {
                lat: "37.498863932227",
                lng: "127.03167064582",
            }, // 사용자 경위도 기본값
        },
        locationGroups: [], // 지역 그룹 데이터
    },
    reducers: {
        setCategory(state, action) {
            state.category = action.payload;
        },
        setCategoryGroups(state, action) {
            state.categoryGroups = action.payload;
        },
        setLocation(state, action) {
            state.location.group = action.payload.group;
            state.location.locations = action.payload.locations ? action.payload.locations : "";
        },
        setLocationGroups(state, action) {
            state.locationGroups = action.payload;
        },
        setCoords(state, action) {
            const { lat, lng } = action.payload;
            state.location.coords = { lat, lng };
        },
        setAddress(state, action) {
            state.location.address = action.payload;
        },
        resetFilter(state) {
            state.category = {
                group: { no: 1, name: "한식" },
                categories: { no: null, name: null },
            };
            state.location = {
                group: "서울",
                locations: "강남구",
                coords: {
                    lat: "37.498863932227",
                    lng: "127.03167064582",
                }
            };
        },
    },
});

export const {
    setCategory,
    setCategoryGroups,
    setLocation,
    setLocationGroups,
    setCoords,
    setAddress,
    resetFilter,
} = filterSlice.actions;

export default filterSlice.reducer;