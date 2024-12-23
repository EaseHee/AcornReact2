import { Button, Image } from "@chakra-ui/react";
import { SiKakao } from "react-icons/si";

export const KakaoLoginButton = () => (
  <Button
    bg="#FEE500"
    color="#000000"
    _hover={{ bg: "#FFD600" }}
    width="full"
    size="lg"
  >
    <SiKakao /> 카카오로 시작하기
  </Button>
);
