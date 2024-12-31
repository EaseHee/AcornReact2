import React, { useCallback, useState, useEffect } from 'react';
import { Button, Fieldset, Stack, Textarea } from '@chakra-ui/react';
import { 
  DialogActionTrigger, 
  DialogBody, 
  DialogCloseTrigger, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogRoot
} from '../../../../components/ui/dialog';
import { NativeSelectField, NativeSelectRoot } from "../../../../components/ui/native-select"
import { Field } from "../../../../components/ui/field";
import { Toaster, toaster } from "../../../../components/ui/toaster";
import axios from 'axios';

export default function CustomDialog({ openBtnText, title, memberNo, review, confirmBtnText, closeBtnText }) {
  const [formData, setFormData] = useState({ rating: "", content: "" });
  const [files, setFiles] = useState([]);
  const [open, setOpen] = useState(false); // 모달 열림/닫힘 상태 관리
  useEffect(()=>{
    setFiles([]);
  },[]);
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files); // FileList를 배열로 변환
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // 기존 파일에 새로 선택한 파일을 추가    
  }, []);

  const handleSubmit = useCallback(async () => {
    const payload = new FormData();
    payload.append("no",review.no);
    payload.append("memberNo",memberNo);
    payload.append("eateryNo",review.reviewEateriesDto.no);
    payload.append("rating",formData.rating);
    payload.append("content",formData.content);
    // 파일들을 FormData에 추가
    files.forEach((file) => payload.append("files", file));
    try {
      await axios.put(`http://localhost:8080/main/mypage/review/${review.no}`, payload, {
        withCredentials: true, // 쿠키를 함께 전송하도록 설정
      });
      closeDialog();
      toaster.create({
        description: "리뷰 수정 성공!",
        type: "success",
      })
      // 페이지 새로고침을 지연시키기 위해 setTimeout 사용
      setTimeout(() => {
        window.location.reload();  // 페이지 새로고침
      }, 1000);  // 1초 후 새로고침
    } catch (error) {
      toaster.create({
        description: "리뷰 수정 실패!",
        type: "error",
      })
    }
  }, [formData, files]);
  const closeDialog = () => {
    setOpen(false); // 상태를 false로 설정하여 다이얼로그 닫기
  };
  return (
    <DialogRoot placement="center" open={open} onOpenChange={setOpen}>
      <Toaster/>
      <DialogTrigger asChild>
        <Button size="sm">{openBtnText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}님 리뷰 등록</DialogTitle>
          <hr />
        </DialogHeader>
        <DialogBody>
          <Fieldset.Root size="lg" maxW="md">
            <Stack>
              <Fieldset.Legend>가게에 대한 솔직한 평을 남겨주세요.</Fieldset.Legend>
            </Stack>
            <Fieldset.Content>
              <Field label="별점">
                <NativeSelectRoot>
                  <NativeSelectField name="rating" value={formData.rating} onChange={handleInputChange}>
                    <option value="5">★★★★★</option>
                    <option value="4">★★★★☆</option>
                    <option value="3">★★★☆☆</option>
                    <option value="2">★★☆☆☆</option>
                    <option value="1">★☆☆☆☆</option>
                    <option value="0">☆☆☆☆☆</option>
                  </NativeSelectField>
                </NativeSelectRoot>
              </Field>
              <Field label="내용">
                <Textarea name="content" value={formData.content} onChange={handleInputChange} />
              </Field>
              <Field label="파일 업로드">
                <input 
                  type="file" 
                  name="files" 
                  multiple 
                  onChange={handleFileChange} 
                />
              </Field>
            </Fieldset.Content>
          </Fieldset.Root>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" onClick={closeDialog}>{closeBtnText}</Button>
          </DialogActionTrigger>
          <Button onClick={handleSubmit} >{confirmBtnText}</Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
