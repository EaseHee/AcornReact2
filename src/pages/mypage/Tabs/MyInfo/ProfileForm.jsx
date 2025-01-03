import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import { Field } from "../../../../components/ui/field";
import { PasswordInput } from "../../../../components/ui/password-input";
import { useForm } from "react-hook-form";
import { DaumPostAPI } from "../../../auth/DaumPostAPI";
import DuplicatedNickname from "./DuplicatedNickname";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteAccount from "./DeleteAccount";

const ProfileForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    watch,
  } = useForm();

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [formError, setFormError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const watchPassword = watch("changePassword");

  // 사용자 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/main/mypage/members/read",
          {
            withCredentials: true,
          }
        );

        if (response.data) {
          setUserInfo(response.data); // 사용자 정보 저장
        }
      } catch (err) {
        setFormError("사용자 정보를 불러올 수 없습니다.");
      }
    };
    fetchUserInfo();
  }, []);

  // 사용자 정보가 성공적으로 로드되면 setValue로 폼 필드 초기화
  useEffect(() => {
    if (userInfo) {
      setValue("nickname", userInfo.nickname);
      setValue("phone", userInfo.phone);
      setValue("postcode", userInfo.postcode);
      setValue("roadAddress", userInfo.roadAddress);
      setValue("detailAddress", userInfo.detailAddress);
    }
  }, [userInfo, setValue]);

  const handleProfileUpdate = async (data) => {
    if (!isNicknameAvailable) {
      setError("nickname", {
        type: "manual",
        message: "닉네임 중복 확인을 해주세요.",
      });
      return;
    }
    //console.log("클라이언트에서 보내는 데이터: ", data);
    try {
      const response = await axios.put(
        "http://localhost:8080/main/mypage/members/update",
        data,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        //alert("프로필 수정 완료");
        setIsModalOpen(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data;

        if (error.response.status === 400) {
          if (message === "중복된 닉네임입니다.") {
            setError("nickname", { type: "manual", message });
          } else if (message === "중복된 휴대전화 번호입니다.") {
            setError("phone", { type: "manual", message });
          } else if (message === "현재 비밀번호가 일치하지 않습니다.") {
            setError("currentPassword", { type: "manual", message });
          } else {
            setFormError("서버에서 처리할 수 없는 요청입니다.");
          }
        } else if (error.response.status === 404) {
          setFormError("사용자를 찾을 수 없습니다.");
        } else if (error.response.status === 500) {
          setFormError("서버 오류가 발생했습니다.");
        } else {
          setFormError("알 수 없는 오류가 발생했습니다.");
        }
      } else {
        setFormError("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      }
    }
  };

  const onSubmit = handleSubmit((data) => {
    setFormError("");
    handleProfileUpdate(data);
  });

  return (
    <>
    <form onSubmit={onSubmit}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="full"
      >
        <Stack gap="1" align="flex-start" maxW="xl" width="full">
          <Text fontSize="2xl" fontWeight="bold" mb="6">
            개인 정보 수정
          </Text>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="full"
          >
            <Box flex="7" mr="4">
              <Field
                label="닉네임"
                invalid={!!errors.nickname}
                errorText={errors.nickname?.message}
              >
                <Input
                  size="md"
                  placeholder="한글과 영어만 입력해주세요."
                  width="100%"
                  {...register("nickname", {
                    required: "닉네임은 필수 입력입니다.",
                    pattern: {
                      value: /^[\s\S]{2,20}$/,
                      message: "닉네임은 최소 2자 이상 20자 이하입니다.",
                    },
                  })}
                />
              </Field>
            </Box>
            <Box flex="3">
              <Field
                label="&nbsp;"
                invalid={!!errors.nickname}
                errorText="&nbsp;"
              >
                <DuplicatedNickname
                  nickname={watch("nickname")}
                  setIsNicknameAvailable={setIsNicknameAvailable}
                />
              </Field>
            </Box>
          </Box>
          <Field
            label="현재 비밀번호"
            invalid={!!errors.currentPassword}
            errorText={errors.currentPassword?.message}
          >
            <PasswordInput
              size="md"
              placeholder="현재 비밀번호를 입력해주세요."
              width="100%"
              {...register("currentPassword", {
                required: "현재 비밀번호는 필수 입력입니다.",
              })}
            />
          </Field>
          <Field
            label="수정 비밀번호"
            invalid={!!errors.password}
            errorText={errors.password?.message}
          >
            <PasswordInput
              size="md"
              placeholder="수정할 비밀번호를 입력해주세요."
              width="100%"
              {...register("changePassword", {
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
                validate: (value) =>
                  value === watchPassword || "비밀번호가 일치하지 않습니다.",
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
          <Stack spacing="4" width="full" mt="4">
            <Box
              display="flex"
              justifyContent="flex-end"
              width="full"
              gap="4"
              mt="1"
            >
              {formError && (
                <Text color="red.500" mb="4">
                  {formError}
                </Text>
              )}
              <Button type="submit" colorPalette="orange" size="lg">
                프로필 수정
              </Button>
              <DeleteAccount />
            </Box>
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
            p={8}
            borderRadius="md"
            boxShadow="lg"
            maxWidth="600px"
            width="80%" // 화면 크기에 따라 적응하도록 설정
            textAlign="center"
            transform="scale(1)"
            transition="all 0.3s ease"
            _hover={{ transform: "scale(1.05)" }} // 호버시 크기 증가
          >
            <Text fontSize="lg" fontWeight="bold" color="orange.500" mb={4}>
              프로필 수정이 완료되었습니다.
            </Text>
            <Text fontSize="md" color="black.600" mb={6}>
              메인 페이지로 이동합니다.
            </Text>

            <Button
              colorPalette="orange"
              size="lg"
              onClick={() => {
                navigate("/");
              }}
              width="100%"
            >
              메인 페이지로 가기
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ProfileForm;
