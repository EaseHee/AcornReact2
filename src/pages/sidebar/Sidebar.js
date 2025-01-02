import React from "react";
import "./Sidebar.css"; // 스타일 파일
import { Box } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
//npm install react-icons
import { FaHouse, FaUser } from "react-icons/fa6";

// 메뉴 항목 데이터
export const menuItems = [
  { icon: <FaHouse />, label: "", path: "/" },
  { icon: <FaUser />, label: "", path: "/mypage" },
];

const Sidebar = () => {
  const location = useLocation(); // 현재 경로 가져오기

  return (
    <Box
      width="80px" // 사이드바 폭
      display="flex"
      flexDirection="column"
      alignItems="center"
      position="sticky"
      top="20%" // 상단에서 약간 떨어진 위치
      bg="white"
      borderRadius="md"
      boxShadow="lg"
      p={4}
      gap={6}
    >
      {menuItems.map((item, index) => {
        const isActive = location.pathname === item.path; // 현재 경로와 메뉴 경로 비교
        return (
          <Link to={item.path} key={index} style={{ textDecoration: "none" }}>
            <div className={`sidebar-item ${isActive ? "active" : ""}`}>
              <div className="icon">{item.icon}</div>
              <span className="label">{item.label}</span>
            </div>
          </Link>
        );
      })}
    </Box>
  );
};

export default Sidebar;
