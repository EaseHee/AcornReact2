/**
 * 사용자 로그인 정보를 브라우저의 LocalStorage에 쿠키로 저장
 */
export const saveToLocalStorage = (state) => {
    try {
        const expirationTime = new Date().getTime() + 30 * 60 * 1000; // 30분 후 만료
        const serializedState = JSON.stringify({ ...state, expirationTime });
        localStorage.setItem('auth', serializedState);
        localStorage.setItem('theme', "light");
    } catch (error) {
        console.error('Local Storage에 사용자 정보 저장에 실패하였습니다.', error);
    }
};

/**
 * 화면이 재렌더 되었을 경우 redux-상태변수는 초기화되기 때문에 LocalStorage에서 쿠키 정보 반환
 */
export const loadFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('auth');
        if (!serializedState) return undefined;

        const parsedState = JSON.parse(serializedState);
        const currentTime = new Date().getTime();

        // 만료 시간 확인
        if (parsedState.expirationTime && currentTime > parsedState.expirationTime) {
            console.log('로그인 정보가 만료되었습니다.');
            localStorage.removeItem('auth'); // 만료된 정보 삭제
            return undefined;
        }

        return { isLoggedIn: parsedState.isLoggedIn };
    } catch (error) {
        console.error('Local Storage에서 사용자 정보 반환에 실패하였습니다.', error);
        return undefined;
    }
};