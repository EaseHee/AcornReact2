import { createSlice } from "@reduxjs/toolkit";

const eateriesSlice = createSlice({
    name: "eateries",
    initialState: {
        eateries: [], // 음식점 목록
        pagination: { page: 1, size: 12 }, // 페이지 정보
        isRecommended: false, // 추천 상태
    },
    reducers: {
        setEateries(state, action) {
            state.eateries = action.payload;
        },
        setPage(state, action) {
            state.pagination.page = action.payload;
        },
        setRecommendation(state, action) {
            state.isRecommended = action.payload; // 추천 여부 설정
        },
    },
});

export const { setEateries, setPage, shuffleEateries, setRecommendation } = eateriesSlice.actions;

export default eateriesSlice.reducer;