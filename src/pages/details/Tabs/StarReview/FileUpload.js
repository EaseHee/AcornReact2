import {Button} from '@chakra-ui/react';
import { FileUploadList, FileUploadRoot, FileUploadTrigger } from "../../../../components/ui/file-upload"
import { HiUpload } from "react-icons/hi"

export default function FileUpload({ onChange }){
  const handleFileChange = (files) => {
    onChange(files);
  };
    return (        
        <FileUploadRoot maxFiles={5}>
          <FileUploadTrigger asChild>
            <Button variant="outline" size="sm">
              <HiUpload /> 사진 업로드
            </Button>
          </FileUploadTrigger>
        <FileUploadList onChange={handleFileChange} showSize clearable />
      </FileUploadRoot>
    );
}