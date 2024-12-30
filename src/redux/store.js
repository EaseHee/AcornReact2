import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

const persistedState = loadFromLocalStorage();

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    preloadedState: persistedState, // 초기 상태로 로드
});

// 상태 변경 시 localStorage에 저장
store.subscribe(() => {
    saveToLocalStorage({
        auth: store.getState().auth,
    });
});

export default store;