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

const DuplicatedNickname = () => {
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button colorPalette="orange" width="full" size="lg">
          중복 확인
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>닉네임 중복 확인</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>입력하신 닉네임은 사용 가능한 닉네임 입니다.</p>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button colorPalette="orange">사용하기</Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default DuplicatedNickname;
