/**
 * 사용자 로그인 정보를 브라우저의 LocalStorage에 쿠키로 저장
 * @param state
 */
export const saveToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('auth', serializedState);
    } catch (error) {
        console.error('Local Storage에 사용자 정보 저장에 실패하였습니다.', error);
    }
};

/**
 * 화면이 재렌더 되었을 경우 redux-상태변수는 초기화되기 때문에 LocalStorage에서 쿠키 정보 반환
 * @returns {undefined|any}
 */
export const loadFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('auth');
        return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (error) {
        console.error('Local Storage에서 사용자 정보 반환에 실패하였습니다.', error);
        return undefined;
    }
};