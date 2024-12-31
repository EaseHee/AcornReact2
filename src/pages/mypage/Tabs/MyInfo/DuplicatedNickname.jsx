import { useState } from "react";
import { Button } from "../../../../components/ui/button";
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
} from "../../../../components/ui/dialog";
import axios from "axios";

const DuplicatedNickname = ({ nickname, setIsNicknameAvailable }) => {

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckNickname = async () => {
    try {
      console.log(nickname);
      const response = await axios.get("http://localhost:8080/members/check-nickname", {
        withCredentials: true,
        params: { nickname }, 
      });
      if (response.status === 200) {
        setMessage("사용 가능한 닉네임입니다..");
        setIsSuccess(true);
        setIsNicknameAvailable(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage("이미 사용 중인 닉네임입니다.");
        setIsSuccess(false);
        setIsNicknameAvailable(false);
      } else {
        setMessage("닉네임 확인 중 오류가 발생했습니다.");
      }
    }
  }
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button colorPalette="orange" width="full" size="lg" onClick={handleCheckNickname}>
          중복 확인
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>닉네임 중복 확인</DialogTitle>
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

export default DuplicatedNickname;
