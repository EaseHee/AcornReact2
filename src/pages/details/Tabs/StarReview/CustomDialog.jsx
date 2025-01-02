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
  DialogRoot,
  DialogTrigger
} from '../../../../components/ui/dialog';
import { NativeSelectField, NativeSelectRoot } from "../../../../components/ui/native-select"
import { Field } from "../../../../components/ui/field"
import { Toaster, toaster } from "../../../../components/ui/toaster"
import axios from 'axios';

export default function CustomDialog({ onReviewSubmitted, openBtnText, title, memberNo, eateryNo, confirmBtnText, closeBtnText }) {
  const [formData, setFormData] = useState({ rating: "", content: "" });
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
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    const payload = new FormData();
    payload.append("memberNo",memberNo);
    payload.append("eateryNo",eateryNo);
    payload.append("rating",formData.rating);
    payload.append("content",formData.content);
    // 파일들을 FormData에 추가
    files.forEach((file) => payload.append("files", file));
    try {
      await axios.post("http://localhost:8080/main/mypage/review", payload, {
        withCredentials: true, // 쿠키를 함께 전송하도록 설정
      });
      toaster.create({
        description: "리뷰 등록 성공!",
        type: "success",
      })
      onReviewSubmitted();
    } catch (error) {
      toaster.create({
        description: "리뷰 등록 실패!",
        type: "error",
      })
    }
  }, [formData, files]);
  return (
    <DialogRoot placement="center">
      <Toaster/>
      <DialogTrigger asChild>
        <Button colorPalette="orange" size="sm"> {openBtnText}</Button>
      </DialogTrigger>
      <DialogContent >
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
            <Button variant="outline">{closeBtnText}</Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger/>
      </DialogContent>
    </DialogRoot>
  );
}
