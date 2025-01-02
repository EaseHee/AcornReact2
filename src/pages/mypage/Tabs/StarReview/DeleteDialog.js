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
const DeleteDialog = ({reviewNo, onReviewSubmitted}) => {
    //리뷰 삭제
    const deleteMyReview= async (reviewNo)=>{
    try {
        const response = await axios.delete(`http://localhost:8080/main/mypage/review/${reviewNo}`, {
            withCredentials: true, // 쿠키를 함께 전송하도록 설정
          });
        if(response.data){
        toaster.create({
            description: response.data,
            type: "success",
        })}
        setTimeout(() => {
            onReviewSubmitted();
          }, 700);
    } catch (error) {
        toaster.create({
        description: "리뷰 삭제 실패!",
        type: "error",
        })
    }
    };
    return (
        <DialogRoot role="alertdialog">
        <Toaster/>
        <DialogTrigger asChild>
            <Button variant="outline" size="sm">
            삭제
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
            <Button colorPalette="orange" onClick={() => deleteMyReview(reviewNo)}>삭제</Button>
            </DialogActionTrigger>
            <DialogActionTrigger asChild>
                <Button variant="outline">취소</Button>
            </DialogActionTrigger>
            </DialogFooter>
            <DialogCloseTrigger />
        </DialogContent>
        </DialogRoot>
    )
}
export default DeleteDialog;