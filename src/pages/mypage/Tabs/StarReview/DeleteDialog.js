import { useState } from "react";
import { Button } from "../../../../components/ui/button"
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
} from "../../../../components/ui/dialog"
import { Toaster, toaster } from "../../../../components/ui/toaster";
import axios from 'axios';
const DeleteDialog = ({reviewNo}) => {
    const [open, setOpen] = useState(false); // 모달 열림/닫힘 상태 관리
    //리뷰 삭제
    const deleteMyReview= async (reviewNo)=>{
    try {
        const response = await axios.delete(`http://localhost:8080/main/mypage/review/${reviewNo}`, {
            withCredentials: true, // 쿠키를 함께 전송하도록 설정
          });
        if(response.data){
        closeDialog();
        toaster.create({
            description: response.data,
            type: "success",
        })}
        // 페이지 새로고침을 지연시키기 위해 setTimeout 사용
        setTimeout(() => {
            window.location.reload();  // 페이지 새로고침
        }, 1000);  // 1초 후 새로고침
    } catch (error) {
        toaster.create({
        description: "리뷰 삭제 실패!",
        type: "error",
        })
    }
    };
    const closeDialog = () => {
        setOpen(false); // 상태를 false로 설정하여 다이얼로그 닫기
      };
    return (
        <DialogRoot role="alertdialog" open={open} onOpenChange={setOpen}>
        <Toaster/>
        <DialogTrigger asChild>
            <Button variant="outline" size="sm">
            리뷰 삭제
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>정말로 삭제 하시겠습니까?</DialogTitle>
            </DialogHeader>
            <DialogBody>
            <p>
                삭제된 리뷰(사진 포함)는 복구할 수 없습니다.
            </p>
            </DialogBody>
            <DialogFooter>
            <DialogActionTrigger asChild>
                <Button variant="outline"  onClick={closeDialog}>취소</Button>
            </DialogActionTrigger>
            <Button colorPalette="red" onClick={() => deleteMyReview(reviewNo)}>삭제</Button>
            </DialogFooter>
            <DialogCloseTrigger />
        </DialogContent>
        </DialogRoot>
    )
}
export default DeleteDialog;