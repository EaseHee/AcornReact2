import { Button } from "@chakra-ui/react";
import React from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";

export const DaumPostAPI = ({ setValue }) => {
  // Daum 우편번호 팝업창 스크립트 주소
  const open = useDaumPostcodePopup(
    "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
  );

  // 우편번호 검색 완료 시 호출되는 함수
  const handleComplete = (data) => {
    let fullAddress = data.address; // 전체 주소 초기화
    let extraAddress = ""; // 추가 주소 초기화

    // 주소 타입이 'R' (도로명 주소)일 경우
    if (data.addressType === "R") {
      // 건물명(bname)이 존재하면 추가 주소에 추가
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      // 건물명(buildingName)이 존재하면 추가 주소에 추가
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      // 전체 주소에 추가 주소를 붙임
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    // 우편번호와 도로명 주소 업데이트
    setValue("postcode", data.zonecode); // 우편번호
    setValue("roadAddress", fullAddress); // 도로명 주소
    //console.log(fullAddress);

    // 팝업창 닫힌 후 상세 주소 입력 필드로 포커스 이동
    setTimeout(() => {
      const detailAddressInput = document.querySelector("#detailAddress"); // 상세 주소 입력 필드 선택
      if (detailAddressInput) {
        detailAddressInput.focus(); // 상세 주소 입력 필드로 포커스 이동
      }
    }, 100); // 100ms 후에 포커스 이동
  };

  // 버튼 클릭 시 우편번호 팝업 열기
  const handleClick = () => {
    open({ onComplete: handleComplete }); // 팝업 오픈 및 완료 시 핸들러 설정
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      colorPalette="orange"
      width="full"
      size="lg"
    >
      우편변호 찾기
    </Button>
  );
};
