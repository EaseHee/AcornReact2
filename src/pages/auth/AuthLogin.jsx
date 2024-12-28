import { Box, Button, Input, Stack, Link, Text, Image } from "@chakra-ui/react";
import { Field } from "../../components/ui/field";
import { PasswordInput } from "../../components/ui/password-input";
import { useForm } from "react-hook-form";
import axios from "axios";
import FindPassword from "./FindPassword";
import FindEmail from "./FindEmail";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AuthLogin = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const savedEmail = Cookies.get("savedEmail"); // 쿠키에 저장된 아이디 가져오기
    const savedChecked = Cookies.get("checked"); // 체크박스 상태 가져오기
    console.log(savedChecked);
    if (savedChecked === "true") {
      setChecked(true); // 체크박스 체크된 상태로 설정
    }
    if (savedEmail) {
      setValue("email", savedEmail); // 이메일 값이 있으면 입력란에 세팅
    }
  }, [setValue]);

  const handleLogin = async (data) => {
    // 체크박스 상태에 따라 쿠키 저장/삭제
    if (checked) {
      Cookies.set("savedEmail", data.email, { expires: 7 });
      Cookies.set("checked", "true", { expires: 7 });
    } else {
      Cookies.remove("savedEmail");
      Cookies.remove("checked");
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        data,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsLoggedIn(true);
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        setLoginError("이메일 또는 비밀번호를 확인해주세요.");
        console.error("Response Error:", error.response.data); // 서버에서 반환한 에러 메시지
      } else {
        setLoginError("네트워크 오류 입니다.");
        console.error("Axios Error:", error.message); // 네트워크 오류나 Axios 문제
      }
    }
  };

  const onSubmit = handleSubmit((data) => {
    handleLogin(data);
  });

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

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="full"
          >
            <label style={styles.customCheckbox}>
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                style={styles.hiddenCheckbox}
              />
              <span
                style={{
                  ...styles.checkmark,
                  ...(checked ? styles.checkedCheckmark : {}),
                }}
              >
                {checked && <span style={styles.checkIcon}>✔</span>}
              </span>
              <span style={styles.checkboxLabel}>이메일 기억하기</span>{" "}
            </label>

            <Box display="flex" alignItems="center" gap="1" mr="2">
              <FindEmail height="40px" />
              <FindPassword height="40px" />
            </Box>
          </Box>
          {loginError && (
            <Text color="red.500" fontSize="sm" mb="2">
              {loginError}
            </Text>
          )}
          <Stack spacing="2" width="full" mt="1">
            <Button type="submit" colorPalette="orange" width="full" size="lg">
              로그인
            </Button>
          </Stack>
        </Stack>
      </Box>
    </form>
  );
};

// 스타일링 (CSS-in-JS)
const styles = {
  customCheckbox: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "16px",
  },
  hiddenCheckbox: {
    display: "none",
  },
  checkmark: {
    position: "relative",
    display: "inline-block",
    width: "20px",
    height: "20px",
    border: "2px solid #ccc",
    borderRadius: "4px",
    marginRight: "8px",
    backgroundColor: "#fff",
    transition: "background-color 0.2s ease, border-color 0.2s ease",
  },
  checkedCheckmark: {
    backgroundColor: "#f85f00",
    borderColor: "#f85f00",
  },
  checkIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "16px",
    color: "#fff",
  },
  checkboxLabel: {
    fontSize: "14px",
  },
};

export default AuthLogin;
