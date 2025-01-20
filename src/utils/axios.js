import axios from "axios";
export const baseURL = process.env.REACT_APP_API_BASE_URL || "https://port-0-forklog-m10lhqc01e8bd7d0.sel4.cloudtype.app";
/**
 * 서버 요청 기본 URL 설정 및 쿠키 전송 허용 여부 설정 인스턴스 생성
 * @type {axios.AxiosInstance}
 * import axios from "utils/axios" 로 사용가능.
 */
const instance = axios.create({
    baseURL: baseURL, // 기본 URL 설정
    withCredentials: true, // 쿠키 전송 허용
});

export default instance;