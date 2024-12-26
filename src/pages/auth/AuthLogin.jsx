import { Box, Button, Input, Stack, Link, Text, Image } from "@chakra-ui/react";
import { Field } from "../../components/ui/field";
import { PasswordInput } from "../../components/ui/password-input";
import { Checkbox } from "../../components/ui/checkbox";
import { KakaoLoginButton } from "./KakaoLogin";
import { useForm } from "react-hook-form";
import axios from "axios";
import FindPassword from "./FindPassword";
import FindEmail from "./FindEmail";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AuthLogin = ({setIsLoggedIn}) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const savedChecked = Cookies.get('checked') === 'true';
    const savedEmail = Cookies.get('savedEmail');

    if (savedChecked) {
      setChecked(true);
    }
    if (savedEmail) {
      setValue("email", savedEmail);
    }
  }, [setValue]);

  const handleLogin = async (data) => {
    if (checked) {
      Cookies.set('savedEmail', data.email, { expires: 7 });
      Cookies.set('checked', 'true', { expires: 7 });
    } else {
      Cookies.remove('savedEmail');
      Cookies.remove('checked');
    }

    try {
      const response = await axios.post("http://localhost:8080/auth/login", data, {
        withCredentials: true,
      });

      if (response.status === 200) {
        alert("로그인 성공");
        setIsLoggedIn(true); // 로그인 상태 업데이트
        navigate("/");
      }
    } catch (error) {
      console.error("로그인 에러: ", error);
      alert("로그인 실패");
    }
  };

  const onSubmit = handleSubmit((data) => {
    handleLogin(data);
  });

  const handleCheckboxChange = () => {
    setChecked((prevChecked) => !prevChecked);
  };

  return (
    <form onSubmit={onSubmit}>
      <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
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
          <Box display="flex" alignItems="center" justifyContent="space-between" width="full">
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
              placeholder="이메일을 입력해주세요."
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
              placeholder="비밀번호를 입력해주세요."
              {...register("password", {
                required: "비밀번호는 필수 입력입니다.",
              })}
            />
          </Field>

          <Box display="flex" alignItems="center" justifyContent="space-between" width="full">
            <Checkbox
              colorPalette="orange"
              checked={checked}
              onChange={handleCheckboxChange}
            >
              이메일 기억하기
            </Checkbox>

            <Box display="flex" alignItems="center" gap="1" mr="2">
              <FindEmail height="40px" />
              <FindPassword height="40px" />
            </Box>
          </Box>
          <Stack spacing="2" width="full" mt="1">
            <Button type="submit" colorPalette="orange" width="full" size="lg">
              로그인
            </Button>
            <KakaoLoginButton />
          </Stack>
        </Stack>
      </Box>
    </form>
  );
};

export default AuthLogin;