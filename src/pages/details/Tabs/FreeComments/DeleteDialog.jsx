import { Button } from '../../../../components/ui/button';
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
} from '../../../../components/ui/dialog';

const DeleteDialog = ({ onClick }) => {
  return (
    <DialogRoot role="alertdialog">
      <DialogTrigger asChild>
        <Button colorPalette="orange" colorScheme="red" size="sm">
          삭제
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>정말 댓글을 삭제하시겠습니까?</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>
            삭제된 댓글은 복구할 수 없습니다. 만약 대댓글이 존재할 경우 댓글은 삭제 상태로 변경되며 대댓글이 모두 삭제될 때까지
            흔적이 남습니다.
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button colorPalette="red" onClick={onClick}>
              삭제
            </Button>
          </DialogActionTrigger>
          <DialogActionTrigger asChild>
            <Button variant="outline">취소</Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteDialog;
