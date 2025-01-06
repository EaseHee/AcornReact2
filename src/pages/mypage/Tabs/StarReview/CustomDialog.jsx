import React, { useCallback, useState } from 'react';
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
import axios from 'utils/axios';
export default function CustomDialog({ onReviewSubmitted, openBtnText, title, memberNo, review, confirmBtnText, closeBtnText, onClose }) {
  const [formData, setFormData] = useState({ rating: "0", content: "" });
  const [files, setFiles] = useState([]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files); // FileList를 배열로 변환
    if (selectedFiles.length === 0) {
      // 파일이 선택되지 않으면 상태를 빈 배열로 설정
      setFiles([]);
    } else {
      // 기존 파일에 새로 선택한 파일을 추가
      setFiles(selectedFiles);
    }
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
      await axios.put(`/main/mypage/review/${review.no}`, payload);
      toaster.create({
        description: "리뷰 수정 성공!",
        type: "success",
      })
      setTimeout(() => {
        onReviewSubmitted();        
      }, 700);
    } catch (error) {
      toaster.create({
        description: "리뷰 수정 실패!",
        type: "error",
      })
    }
  }, [formData, files]);

  return (
    <DialogRoot placement="center">
      <Toaster/>
      <DialogTrigger asChild>
        <Button colorPalette="orange" size="sm">{openBtnText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}님 리뷰 수정</DialogTitle>
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
                    <option value="0">☆☆☆☆☆</option>
                    <option value="5">★★★★★</option>
                    <option value="4">★★★★☆</option>
                    <option value="3">★★★☆☆</option>
                    <option value="2">★★☆☆☆</option>
                    <option value="1">★☆☆☆☆</option>
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
                  accept='image/*'
                  onChange={handleFileChange} 
                />
              </Field>
            </Fieldset.Content>
          </Fieldset.Root>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
          <Button colorPalette="orange" onClick={handleSubmit} >{confirmBtnText}</Button>
          </DialogActionTrigger>
          <DialogActionTrigger asChild>
            <Button colorPalette="orange">{closeBtnText}</Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
