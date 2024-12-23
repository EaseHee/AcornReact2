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

const DuplicatedEmail = () => {
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button colorPalette="orange" width="full" size="lg">
          중복 확인
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>이메일 중복 확인</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>입력하신 이메일은 사용 가능한 이메일 입니다.</p>
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

export default DuplicatedEmail;
