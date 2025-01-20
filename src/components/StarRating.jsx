import React, { useState } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import {Box, Span} from "@chakra-ui/react";

/**
 * 별점 등록 시 마우스 호버, 클릭으로 동적으로 처리
 * @param value : 기본 평점
 * @param onChange : 핸들러
 * @returns {JSX.Element}
 * @constructor
 */
const StarRating = ({ value = 0, onChange }) => {
    const [hoveredRating, setHoveredRating] = useState(0); // 마우스 호버 상태
    const [selectedRating, setSelectedRating] = useState(value); // 선택된 별점

    // 별 클릭 이벤트
    const handleClick = (rating) => {
        setSelectedRating(rating);
        onChange && onChange(rating); // 부모 컴포넌트에 값 전달
    };

    // 마우스 호버 이벤트
    const handleMouseMove = (e, star) => {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - left; // 마우스 X 좌표
        const hoverValue = mouseX < width / 2 ? star - 0.5 : star; // 반쪽(0.5) 또는 전체(1)
        setHoveredRating(hoverValue);
    };

    // 마우스 호버 종료
    const handleMouseLeave = () => {
        setHoveredRating(0); // 호버 상태 초기화
    };

    // 별 아이콘 선택
    const getStarIcon = (index) => {
        const rating = hoveredRating || selectedRating;
        const iconStyle = { color: "#FF6600" }; // 별 색상 지정

        if (rating >= index) return <FaStar style={iconStyle} />; // 완전 채워진 별
        if (rating >= index - 0.5) return <FaStarHalfAlt style={iconStyle} />; // 반쪽 별
        return <FaRegStar style={iconStyle} />; // 빈 별
    };

    return (
        <div style={{ display: "flex", gap: "4px", cursor: "pointer" }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onMouseMove={(e) => handleMouseMove(e, star)} // 마우스 이동 처리
                    onMouseLeave={handleMouseLeave} // 마우스 떠나기 처리
                    onClick={() => handleClick(hoveredRating || star)} // 클릭된 별 저장
                    style={{ fontSize: "24px" }}
                >
          {getStarIcon(star)}
        </span>
            ))}
        </div>
    );
};

export default StarRating;


//평점 별모양으로 변환
export const getStarRating = (rating) => {
    const fullStars = Math.floor(rating); // 완전 채운 별 개수
    const hasHalfStar = rating % 1 >= 0.5; // 반쪽 별 여부
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // 빈 별 개수

    // 별 조합 (아이콘 배열 생성)
    const stars = [
        ...Array(fullStars).fill(<FaStar/>), // 채워진 별
        ...(hasHalfStar ? [<FaStarHalfAlt />] : []), // 반쪽 별
        ...Array(emptyStars).fill(<FaRegStar />), // 빈 별
    ];

    return (
        <Box style={{ display: "flex", alignItems: "center" }}>
            {stars.map((star, index) => (
                <Span key={index} style={{ fontSize: "15px" }}>
                    {star}
                </Span>
            ))}
            <Span>&nbsp;{rating}</Span>
        </Box>
    );
};