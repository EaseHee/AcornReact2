import { Button } from '../components/ui/button';
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
} from '../components/ui/dialog';
export default function CustomDialog({ openBtnText, title, body, confirmBtnText, closeBtnText, onConfirm }) {
  return (
    <DialogRoot placement="center">
      <DialogTrigger asChild>
        <Button size="sm">{openBtnText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <hr />
        </DialogHeader>
        <DialogBody>{body}
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">{closeBtnText}</Button>
          </DialogActionTrigger>
          <Button onClick={() => onConfirm(reviewData)}>{confirmBtnText}</Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
