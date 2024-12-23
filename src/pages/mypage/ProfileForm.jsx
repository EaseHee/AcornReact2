import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import { Field } from "../../components/ui/field";
import { PasswordInput } from "../../components/ui/password-input";
import { useForm } from "react-hook-form";
import { DaumPostAPI } from "../auth/DaumPostAPI";
import DuplicatedNickname from "./DuplicatedNickname";

const ProfileForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm();

  const watchPassword = watch("password");

  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <form onSubmit={onSubmit}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="full"
      >
        <Stack gap="1" align="flex-start" maxW="xl" width="full">
          <Text fontSize="2xl" fontWeight="bold">
            프로필 수정
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
                      value: /^[a-zA-Z가-힣]{2,20}$/,
                      message: "닉네임은 한글과 영어만 입력해야 합니다.",
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
                <DuplicatedNickname />
              </Field>
            </Box>
          </Box>
          <Field
            label="현재 비밀번호"
            invalid={!!errors.password1}
            errorText={errors.password1?.message}
          >
            <PasswordInput
              size="md"
              placeholder="현재 비밀번호를 입력해주세요."
              width="100%"
              {...register("password1", {
                required: "현재 비밀번호는 필수 입력입니다.",
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
            label="수정 비밀번호"
            invalid={!!errors.password}
            errorText={errors.password?.message}
          >
            <PasswordInput
              size="md"
              placeholder="수정할 비밀번호를 입력해주세요."
              width="100%"
              {...register("password", {
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
              <Button type="submit" colorPalette="orange" size="lg">
                수정
              </Button>
              <Button colorPalette="orange" size="lg">
                취소
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </form>
  );
};

export default ProfileForm;
