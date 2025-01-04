import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import axios from "axios";

const DuplicatedEmail = ({ email, setIsEmailAvailable }) => {
  const [message, setMessage] = useState(""); // 응답 메시지 저장
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckEmail = async () => {
    try {
      const response = await axios.get("http://localhost:8080/auth/check-email", {
        params: { email },
      });
      if (response.status === 200) {
        setMessage("사용 가능한 이메일입니다.");
        setIsSuccess(true);
        setIsEmailAvailable(true);  // 이메일이 사용 가능하면 상태 변경
      }
    } catch (error) {
      const { code } = error.response.data;
      if (code === "DM") {
        setMessage("이미 사용 중인 이메일입니다.");
        setIsSuccess(false);
        setIsEmailAvailable(false);  // 이메일이 중복되면 상태 변경
      } else if (code === "VF") {
        setMessage("이메일 형식이 아닙니다.");
        setIsSuccess(false);
        setIsEmailAvailable(false);  // 이메일이 형식이 아니라면 상태 변경
      } else {
        setMessage("이메일 확인 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button
          colorPalette="orange"
          width="full"
          size="lg"
          onClick={handleCheckEmail}
        >
          중복 확인
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>이메일 중복 확인</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>{message}</p>
        </DialogBody>
        {isSuccess && (
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button colorPalette="orange">사용하기</Button>
            </DialogActionTrigger>
          </DialogFooter>
        )}
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default DuplicatedEmail;
