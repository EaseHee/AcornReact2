import { Button } from "@chakra-ui/react";
import { FaGoogle } from "react-icons/fa";

// 구글 로그인 버튼
export const GoogleLoginButton = () => (
  <Button
    bg="white"
    color="gray.600"
    border="1px solid #E0E0E0"
    _hover={{ bg: "gray.100" }}
    width="full"
    size="lg"
  >
    <FaGoogle /> 구글로 시작하기
  </Button>
);
