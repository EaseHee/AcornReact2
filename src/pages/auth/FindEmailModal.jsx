import { Input, Stack, Button } from "@chakra-ui/react";
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

const FindEmailModal = () => {
  const ref = useRef < HTMLInputElement > null;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFindEmail = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/find-email",
        data
      );
      console.log(response.data);
      alert("이메일을 확인해주세요.");
    } catch (error) {
      console.error("이메일 찾기 에러 : ", error);
    }
  };

  const onSubmit = handleSubmit((data) => {
    handleFindEmail(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <DialogRoot initialFocusEl={() => ref.current}>
        <DialogTrigger asChild>
          <Button variant="link" fontSize="sm" p={0} minW="unset">
            이메일
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>이메일 찾기</DialogTitle>
          </DialogHeader>
          <DialogBody pb="4">
            <Stack gap="4" align="flex-start" width="full">
              <Field
                label="이름"
                invalid={!!errors.name}
                errorText={errors.name?.message}
              >
                <Input
                  size="md"
                  placeholder="가입하신 계정의 이름을 입력해주세요."
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
              <Button colorPalette="orange" width="auto">
                이메일 찾기
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

export default FindEmailModal;
