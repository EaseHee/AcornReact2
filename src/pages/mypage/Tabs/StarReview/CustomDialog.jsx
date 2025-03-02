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
} from 'components/ui/dialog';
import { Field } from "components/ui/field";
import { Toaster, toaster } from "components/ui/toaster";
import { InfoTip } from "components/ui/toggle-tip"

import StarRating from 'components/StarRating';

import axios from 'utils/axios';

export default function CustomDialog({ onReviewSubmitted, openBtnText, title, memberNo, review, confirmBtnText, closeBtnText, onClose }) {
  const [formData, setFormData] = useState({ rating: "0", content: "" });
  const [files, setFiles] = useState([]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 별점 등록 처리
  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating })); // 별점 값 업데이트
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
              <Fieldset.Legend>
                가게에 대한 솔직한 평을 남겨주세요.
                <InfoTip content={<>
                  파일업로드는 다중 선택(ctrl키를 누른 채 파일 선택)을 지원합니다.<br></br>
                  기존에 업로드한 파일과 무관하게 업로드할 파일을 모두 선택해 주세요.</>}
                  />
              </Fieldset.Legend>
            </Stack>
            <Fieldset.Content>
              <Field label="별점">
                <StarRating value={formData.rating} onChange={handleRatingChange} />
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
