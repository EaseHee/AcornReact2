import { Box, Button, Input, Stack, Link, Text, Image } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { PasswordInput } from "../../components/ui/password-input.jsx";
import { Checkbox } from "../../components/ui/checkbox";
import { KakaoLoginButton } from "./KakaoLogin";
import { NaverLoginButton } from "./NaverLogin";
import { GoogleLoginButton } from "./GoogleLogin";
import { useForm } from "react-hook-form";
import axios from "axios";
import FindPasswordModal from "./FindPasswordModal";
import FindEmailModal from "./FindEmailModal";

const AuthLogin = () => {
  //const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 로그인 요청
  axios
    .post("http://localhost:8080/main/login", register, {
      withCredentials: true, // 쿠키 포함 요청
    })
    .then((response) => {
      if (response.status === 200) {
        //alert('로그인 성공');
        //navigate('/'); // 로그인 성공 시 이동할 페이지
      }
    })
    .catch((error) => {
      console.error("로그인 에러: ", error); // 기타 에러 로그
    });

  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <form onSubmit={onSubmit}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Stack gap="4" align="flex-start" maxW="sm" width="full">
          <Link href="/">
            <Image
              src="https://example.com/logo.png"
              alt="로고"
              boxSize="45px"
              objectFit="contain"
              mb="4"
            />
          </Link>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="full"
          >
            <Text fontSize="2xl" fontWeight="bold">
              로그인
            </Text>
            <Link href="/register" color="orange.500" fontWeight="bold">
              회원가입
            </Link>
          </Box>
          <Field
            label="이메일"
            invalid={!!errors.email}
            errorText={errors.email?.message}
          >
            <Input
              size="lg"
              {...register("email", {
                required: "이메일은 필수 입력입니다.",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "올바른 이메일 형식으로 입력해주세요.",
                },
              })}
            />
          </Field>
          <Field
            label="비밀번호"
            invalid={!!errors.password}
            errorText={errors.password?.message}
          >
            <PasswordInput
              size="lg"
              {...register("password", {
                required: "비밀번호는 필수 입력입니다.",
                pattern: {
                  value:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/,
                  message:
                    "비밀번호는 최소 8자 이상 최대 20자 이하를 입력해주세요.",
                },
              })}
            />
          </Field>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="full"
          >
            <Checkbox colorPalette="orange" flexShrink={0}>
              이메일 기억하기
            </Checkbox>
            <Box display="flex" alignItems="center" gap="1" mr="2">
              <FindEmailModal />
              <Text fontSize="sm">/</Text>
              <FindPasswordModal />
            </Box>
          </Box>
          <Stack spacing="4" width="full" mt="4">
            <Button type="submit" colorPalette="orange" width="full" size="lg">
              로그인
            </Button>
            <KakaoLoginButton />
            <NaverLoginButton />
            <GoogleLoginButton />
          </Stack>
        </Stack>
      </Box>
    </form>
  );
};

export default AuthLogin;
