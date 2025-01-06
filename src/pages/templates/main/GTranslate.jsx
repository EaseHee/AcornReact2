import React, { useEffect } from "react";
import "./GTranslate.css";

const GTranslate = () => {
  useEffect(() => {
    // GTranslate 설정 및 스크립트 로드
    window.gtranslateSettings = {
      default_language: "ko", // 기본 언어 (한국어)
      detect_browser_language: true, // 브라우저 언어 감지 활성화
      languages: ["es", "de", "th", "mn", "ar", "ko", "en", "ja", "zh-CN"], // 지원 언어
      wrapper_selector: ".gtranslate_wrapper", // 위젯을 렌더링할 선택자
      flag_size: 35, // 국기 크기
      horizontal_position: "middle", // 가로 정렬 (중앙)
      vertical_position: "top", // 상단 정렬
    };

    // GTranslate 스크립트 동적 로드
    const script = document.createElement("script");
    script.src = "https://cdn.gtranslate.net/widgets/latest/flags.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // 컴포넌트 언마운트 시 스크립트 제거
    };
  }, []);

  return <div className="gtranslate_wrapper"></div>;
};

export default GTranslate;
