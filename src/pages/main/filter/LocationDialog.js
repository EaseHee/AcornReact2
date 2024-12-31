import {
  Input,
  Stack,
  Button,
  DialogCloseTrigger,
} from "@chakra-ui/react";

import { DialogActionTrigger, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger,} from "../../../components/ui/dialog"
import { FaMapMarkerAlt } from "react-icons/fa";

import { Field } from "../../../components/ui/field"
import {useRef, useState} from "react"

const LocationDialog = () => {
  const ref = useRef(null)

  const [location, setLocation] = useState(""); // 입력값 상태 변수로 선언

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log("Selected location:", event.target.value); // 입력값 반환
      handleSubmit();
      setLocation("");
    } else {
      setLocation(event.target.value); // 입력값 업데이트
    }
  };

  const handleSubmit = () => {
    console.log("선택한 지역명: ", location); // 입력값 반환
    setLocation("");
  };

  return (
      <DialogRoot initialFocusEl={() => ref.current}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <FaMapMarkerAlt />
            지역 카테고리
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>지역 선택</DialogTitle>
          </DialogHeader>

          <DialogBody pb="4">
            <Stack gap="4">
              <Field label="지역이름">
                <Input
                    ref={ref}
                    placeholder="예) 서울 강남구, 전남 고흥시"
                    value={location} // 상태값 바인딩
                    onChange={handleKeyDown} // 입력값 변경 시 상태 업데이트
                />
              </Field>
            </Stack>
          </DialogBody>

          <DialogFooter>
          <DialogActionTrigger onClick={handleSubmit}>
              <Button colorPalette="orange">적용</Button>
            </DialogActionTrigger>
            <DialogCloseTrigger asChild>
              <Button variant="outline">닫기</Button>
            </DialogCloseTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
  );
};

export default LocationDialog;