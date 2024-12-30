import { useEffect, useState } from 'react';
import { Button, Fieldset, Stack, Textarea } from '@chakra-ui/react';
import { FileUploadList, FileUploadRoot, FileUploadTrigger } from "../../../../components/ui/file-upload";
import { DialogActionTrigger,DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger} from '../../../../components/ui/dialog';
import { HiUpload } from "react-icons/hi";
import { NativeSelectField, NativeSelectRoot } from "../../../../components/ui/native-select"
import { Field } from "../../../../components/ui/field"
import axios from 'axios';
export default function CustomDialog({ openBtnText, title, memberNo, eateryNo, confirmBtnText, closeBtnText }) {
  const [formData, setFormData] = useState({ memberNo, eateryNo, rating: "5", content: "" });
  const [files, setFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(()=>{
  },[]);
  const handleFileChange = (newFiles) => {
    console.log("선택된 파일들:", newFiles);
    setFiles(newFiles);
  };
  const handleSubmit = async () => {
    // 상태 확인
    console.log(formData); // formData 값 확인
    console.log(files); // files 값 확인
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
    files.forEach((file) => payload.append("files", file));
    console.log(payload);
    try {
      const response = await axios.post(`http://localhost:8080/review/member/${memberNo}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("리뷰가 성공적으로 등록되었습니다:", response.data);
    } catch (error) {
      console.error("리뷰 등록에 실패했습니다:", error);
    }
  };

  return (
    <DialogRoot placement="center">
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
            </Fieldset.Content>
          </Fieldset.Root>
          <FileUploadRoot maxFiles={5}>
            <FileUploadTrigger asChild>
              <Button variant="outline" size="sm">
                <HiUpload /> 사진 업로드
              </Button>
            </FileUploadTrigger>
            <FileUploadList onChange={handleFileChange} showSize clearable />
          </FileUploadRoot>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">{closeBtnText}</Button>
          </DialogActionTrigger>
          <Button onClick={handleSubmit}>{confirmBtnText}</Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
