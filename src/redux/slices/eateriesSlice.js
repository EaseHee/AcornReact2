import { createSlice } from "@reduxjs/toolkit";

const eateriesSlice = createSlice({
    name: "eateries",
    initialState: {
        eateries: [], // 음식점 목록
        pagination: { page: 1, size: 12 }, // 페이지 정보
    },
    reducers: {
        setEateries(state, action) {
            state.eateries = action.payload;
        },
        setPage(state, action) {
            state.pagination.page = action.payload;
        },
    },
});

export const { setEateries, setPage } = eateriesSlice.actions;

export default eateriesSlice.reducer;