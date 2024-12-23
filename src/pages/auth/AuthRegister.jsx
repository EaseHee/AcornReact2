import { Box, Button, Input, Stack, Link, Text, Image } from "@chakra-ui/react";
import { Field } from "../../components/ui/field";
import { PasswordInput } from "../../components/ui/password-input";
import { Checkbox } from "../../components/ui/checkbox";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DaumPostAPI } from "./DaumPostAPI";
import Terms1 from "./Terms1";
import Terms2 from "./Terms2";
import DuplicatedEmail from "./DuplicatedEmail";

const AuthRegister = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm();

  const watchPassword = watch("password");

  const handleSignup = (values, { setSubmitting, setErrors }) => {
    // 회원가입 요청
    axios
      .post("http://localhost:8080/auth/signup", values)
      .then((response) => {
        if (response.status === 200) {
          //alert('회원가입 완료');
          //navigate("/main/login"); // 회원가입 성공 시 로그인 페이지로 이동
        }
      })
      .catch((error) => {
        // 오류 응답 처리
        if (error.response) {
          const { code, message } = error.response.data;
          if (code === "DI") {
            setErrors({ submit: "이미 사용 중인 아이디 입니다." });
          } else if (code == "DM") {
            setErrors({ submit: "이미 사용 중인 이메일 입니다." });
          } else if (code == "DP") {
            setErrors({ submit: "이미 사용 중인 번호 입니다." });
          } else if (error.response.status === 500) {
            setErrors({ submit: "각 항목의 형식에 맞게 입력해주세요." });
          }
        } else {
          setErrors({
            submit: "서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
          });
        }
      });
  };

  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <form onSubmit={onSubmit}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        width="full"
      >
        <Stack gap="1" align="flex-start" maxW="xl" width="full">
          {" "}
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
              회원가입
            </Text>
            <Link href="/login" color="orange.500" fontWeight="bold">
              기존 계정으로 로그인
            </Link>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="full"
          >
            <Box flex="7" mr="4">
              <Field
                label="이메일"
                invalid={!!errors.email}
                errorText={errors.email?.message}
              >
                <Input
                  size="md"
                  placeholder="이메일 형식에 맞춰 입력해주세요."
                  width="100%"
                  {...register("email", {
                    required: "이메일은 필수 입력입니다.",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "올바른 이메일 형식으로 입력해주세요.",
                    },
                  })}
                />
              </Field>
            </Box>
            <Box flex="3">
              <Field label="&nbsp;" invalid={!!errors.email} errorText="&nbsp;">
                <DuplicatedEmail />
              </Field>
            </Box>
          </Box>
          <Field
            label="비밀번호"
            invalid={!!errors.password}
            errorText={errors.password?.message}
          >
            <PasswordInput
              size="md"
              placeholder="8자 이상 20자 이하로 입력해주세요."
              width="100%"
              {...register("password", {
                required: "비밀번호는 필수 입력입니다.",
                pattern: {
                  value:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/,
                  message:
                    "비밀번호는 최소 8자 이상 최대 20자 이하, 숫자, 특수문자, 영문자가 포함되어야 합니다.",
                },
              })}
            />
          </Field>
          <Field
            label="비밀번호 확인"
            invalid={!!errors.passwordConfirm}
            errorText={errors.passwordConfirm?.message}
          >
            <PasswordInput
              size="md"
              placeholder="비밀번호 확인"
              width="100%"
              {...register("passwordConfirm", {
                required: "비밀번호 확인은 필수 입력입니다.",
                validate: (value) =>
                  value === watchPassword || "비밀번호가 일치하지 않습니다.",
              })}
            />
          </Field>
          <Field
            label="이름"
            invalid={!!errors.name}
            errorText={errors.name?.message}
          >
            <Input
              size="md"
              placeholder="한글과 영어만 입력해주세요."
              width="100%"
              {...register("name", {
                required: "이름은 필수 입력입니다.",
                pattern: {
                  value: /^[a-zA-Z가-힣]{2,20}$/,
                  message: "이름은 한글과 영어만 입력해야 합니다.",
                },
              })}
            />
          </Field>
          <Field
            label="휴대전화"
            invalid={!!errors.phone}
            errorText={errors.phone?.message}
          >
            <Input
              size="md"
              placeholder="'-'를 제외한 숫자 11자리를 입력해주세요."
              width="100%"
              {...register("phone", {
                required: "휴대전화는 필수 입력입니다.",
                pattern: {
                  value: /^[0-9]{11}$/,
                  message: "'-'를 제외한 숫자 11자리를 입력해주세요.",
                },
              })}
            />
          </Field>
          <Field
            label="생년월일"
            invalid={!!errors.birth}
            errorText={errors.birth?.message}
          >
            <Input
              size="md"
              placeholder="YYYYMMDD 형식으로 입력해주세요."
              width="100%"
              {...register("birth", {
                required: "생년월일은 필수 입력입니다.",
                pattern: {
                  value: /^\d{8}$/,
                  message: "생년월일은 YYYYMMDD 형식이어야 합니다.",
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
            <Box flex="7" mr="4">
              <Field
                label="주소"
                invalid={!!errors.postcode}
                errorText={errors.postcode?.message}
              >
                <Input
                  size="md"
                  placeholder="우편번호"
                  readOnly
                  width="100%"
                  {...register("postcode", {
                    required: "우편번호는 필수 입력입니다.",
                  })}
                />
              </Field>
            </Box>
            <Box flex="3">
              <Field
                label="&nbsp;"
                invalid={!!errors.postcode}
                errorText="&nbsp;"
              >
                <DaumPostAPI setValue={setValue} />
              </Field>
            </Box>
          </Box>
          <Field
            invalid={!!errors.roadAddress}
            errorText={errors.roadAddress?.message}
          >
            <Input
              size="md"
              placeholder="도로명 주소"
              readOnly
              width="100%"
              {...register("roadAddress", {
                required: "도로명 주소는 필수 입력입니다.",
              })}
            />
          </Field>
          <Field
            invalid={!!errors.detailAddress}
            errorText={errors.detailAddress?.message}
          >
            <Input
              id="detailAddress"
              size="md"
              placeholder="상세 주소"
              width="100%"
              {...register("detailAddress", {
                required: "상세 주소는 필수 입력입니다.",
              })}
            />
          </Field>
          <Box
            display="flex"
            alignItems="center"
            width="full"
            flexWrap="nowrap"
            whiteSpace="nowrap"
            fontSize="sm"
          >
            <Checkbox colorPalette="orange" fontSize="xs" size="sm" key="sm">
              회원가입 시&nbsp;
            </Checkbox>
            <Box display="flex" alignItems="center" gap="1" mr="2">
              <Terms1 />
              <Text fontSize="sm">과</Text>
              <Terms2 />
              <Text fontSize="sm">에 동의하게 됩니다.</Text>
            </Box>
          </Box>
          <Stack spacing="4" width="full" mt="4">
            <Button type="submit" colorPalette="orange" width="full" size="lg">
              회원가입
            </Button>
          </Stack>
        </Stack>
      </Box>
    </form>
  );
};

export default AuthRegister;
