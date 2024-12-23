import { Button } from "@chakra-ui/react";
import { SiNaver } from "react-icons/si";

export const NaverLoginButton = () => (
  <Button
    bg="#03C75A"
    color="white"
    _hover={{ bg: "#02B14F" }}
    width="full"
    size="lg"
  >
    <SiNaver /> 네이버로 시작하기
  </Button>
);
