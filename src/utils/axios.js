import axios from "axios";

/**
 * 서버 요청 기본 URL 설정 및 쿠키 전송 허용 여부 설정 인스턴스 생성
 * @type {axios.AxiosInstance}
 * import axios from "utils/axios" 로 사용가능.
 */
const instance = axios.create({
    baseURL: "http://localhost:8080", // 기본 URL 설정
    withCredentials: true, // 쿠키 전송 허용
});

export default instance;