import { Button } from "@chakra-ui/react";
import { SiKakao } from "react-icons/si";

export const KakaoLoginButton = () => {
  const KAKAO_CLIENT_ID = process.env.REACT_APP_REST_API_KEY;
  const REDIRECT_URI = "http://localhost:8080/auth/login/kakao";
  
  const kakaoLogin = () => {
    const kakaoAuthUrl = new URL("https://kauth.kakao.com/oauth/authorize");
    kakaoAuthUrl.searchParams.append("response_type", "code");
    kakaoAuthUrl.searchParams.append("client_id", KAKAO_CLIENT_ID);
    kakaoAuthUrl.searchParams.append("redirect_uri", REDIRECT_URI);

    window.location.href = kakaoAuthUrl.toString();
  };
  
  return (
    <Button
      bg="#FEE500"
      color="#000000"
      _hover={{ bg: "#FFD600" }}
      width="full"
      size="lg"
      onClick={kakaoLogin}
    >
      <SiKakao /> 카카오로 시작하기
    </Button>
  )
};
