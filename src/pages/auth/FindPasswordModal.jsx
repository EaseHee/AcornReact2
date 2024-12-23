import { Input, Stack, Button, Box } from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Field } from "../../components/ui/field";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const FindPasswordModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFindPassword = async (data) => {
    console.log("폼 데이터:", data);
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/find-password",
        data
      );
      console.log(response.data);
      alert("이메일을 확인해주세요.");
    } catch (error) {
      console.error("비밀번호 찾기 에러:", error);
    }
  };

  const onSubmit = handleSubmit((data) => {
    console.log("폼 데이터:", data);
    handleFindPassword(data);
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <DialogRoot disableEnforceFocus>
        <DialogTrigger asChild>
          <Button variant="link" fontSize="sm" p={0} minW="unset">
            비밀번호 찾기
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>비밀번호 찾기</DialogTitle>
          </DialogHeader>
          <DialogBody pb="4">
            <Stack gap="4" align="flex-start" width="full">
              <Field
                label="이메일"
                invalid={!!errors.email}
                errorText={errors.email?.message}
              >
                <Input
                  size="md"
                  placeholder="가입하신 계정의 이메일을 입력해주세요."
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
              <Field
                label="휴대전화"
                invalid={!!errors.phone}
                errorText={errors.phone?.message}
              >
                <Input
                  size="md"
                  placeholder="가입하신 계정의 휴대전화를 입력해주세요."
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
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Stack direction="row" spacing="4" width="100%" justify="flex-end">
              <Button colorPalette="orange" width="auto" type="submit">
                비밀번호 찾기
              </Button>
              <DialogActionTrigger asChild>
                <Button variant="outline" width="auto">
                  취소
                </Button>
              </DialogActionTrigger>
            </Stack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </form>
  );
};

export default FindPasswordModal;
