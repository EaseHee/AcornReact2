import { Box, Button, Input, Stack, Link, Text } from "@chakra-ui/react";
import { Field } from "../../components/ui/field";
import { PasswordInput } from "../../components/ui/password-input";
import { Checkbox } from "../../components/ui/checkbox";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { DaumPostAPI } from "./DaumPostAPI";
import Terms1 from "./Terms1";
import Terms2 from "./Terms2";
import DuplicatedEmail from "./DuplicatedEmail";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";

const AuthRegister = () => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    watch,
    control,
  } = useForm();

  const watchPassword = watch("password");
  const navigate = useNavigate();
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRegister = async (data) => {
    if (!isEmailAvailable) {
      setError("email", {
        type: "manual",
        message: "이메일 중복 확인을 해주세요.",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/register",
        data
      );

      if (response.status === 200) {
        setIsModalOpen(true);
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      }
    } catch (error) {
      if (error.response) {
        const { code } = error.response.data;
        if (code === "DP") {
          setError("phone", {
            type: "manual",
            message: "이미 사용 중인 번호 입니다.",
          });
        } else if (code === "DM") {
          setError("email", {
            type: "manual",
            message: "이미 사용 중인 이메일 입니다.",
          });
        } else if (error.response.status === 500) {
          setError("submit", {
            type: "manual",
            message: "각 항목의 형식에 맞게 입력해주세요.",
          });
        }
      } else {
        setError("submit", {
          type: "manual",
          message: "서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
        });
      }
    }
  };

  const onSubmit = handleSubmit((data) => {
    handleRegister(data);
  });

  return (
    <>
      <form onSubmit={onSubmit}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          width="full"
        >
          <Stack gap="1" align="flex-start" maxW="lg" width="full">
            <Box>
              <Logo />
            </Box>
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
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "올바른 이메일 형식으로 입력해주세요.",
                      },
                    })}
                  />
                </Field>
              </Box>
              <Box flex="3">
                <Field
                  label="&nbsp;"
                  invalid={!!errors.email}
                  errorText="&nbsp;"
                >
                  <DuplicatedEmail
                    email={watch("email")}
                    setIsEmailAvailable={setIsEmailAvailable}
                  />
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
              invalid={!!errors.birthDate}
              errorText={errors.birthDate?.message}
            >
              <Input
                size="md"
                placeholder="YYYYMMDD 형식으로 입력해주세요."
                width="100%"
                {...register("birthDate", {
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
              <Controller
                name="terms"
                control={control}
                rules={{ required: "약관에 동의해야 합니다." }}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    colorPalette="orange"
                    fontSize="xs"
                    size="sm"
                  >
                    회원가입 시&nbsp;
                  </Checkbox>
                )}
              />
              <Box display="flex" alignItems="center" gap="1" mr="2">
                <Terms1 />
                <Text fontSize="sm">과</Text>
                <Terms2 />
                <Text fontSize="sm">에 동의하게 됩니다.</Text>
              </Box>
            </Box>
            {errors.terms && (
              <Box color="red.500" fontSize="sm" mt="2">
                {errors.terms.message}
              </Box>
            )}
            {errors.submit && (
              <Box color="red.500" fontSize="sm" mt="2">
                {errors.submit.message}
              </Box>
            )}
            <Stack spacing="4" width="full" mt="4">
              <Button
                type="submit"
                colorPalette="orange"
                width="full"
                size="lg"
              >
                회원가입
              </Button>
            </Stack>
          </Stack>
        </Box>
      </form>
      {isModalOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.4)" // 반투명 배경
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex="1000"
        >
          <Box
            bg="white"
            p={6}
            borderRadius="md"
            boxShadow="lg"
            maxWidth="400px"
            textAlign="center"
            transform="scale(1)"
            transition="all 0.3s ease"
            _hover={{ transform: "scale(1.05)" }} // 호버시 크기 증가
          >
            <Text fontSize="lg" fontWeight="bold" color="orange.500" mb={4}>
              🎉 회원가입을 축하합니다!
            </Text>
            <Text fontSize="md" color="gray.600" mb={6}>
              로그인 페이지로 이동합니다.
            </Text>

            <Button
              colorPalette="orange"
              size="lg"
              onClick={() => {
                navigate("/login");
              }}
              width="100%"
            >
              로그인 페이지로 가기
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default AuthRegister;
