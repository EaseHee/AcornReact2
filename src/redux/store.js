import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import locationReducer from "./slices/locationSlice";
import eateriesReducer from "./slices/eateriesSlice";
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

const persistedState = loadFromLocalStorage();

const store = configureStore({
    reducer: {
        auth: authReducer, // 사용자 로그인 정보 저장. 브라우저의 Local Storage에 저장
        location: locationReducer, // 사용자의 현재 위치 정보 저장. 상태 변수로 관리
        eateries: eateriesReducer
    },
    preloadedState: persistedState, // 초기 상태로 로드
});

// 상태 변경 시 Local Storage에 저장
store.subscribe(() => {
    saveToLocalStorage({
        auth: store.getState().auth,
    });
});

export default store;