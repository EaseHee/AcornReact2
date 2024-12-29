import React from "react";
import "./Sidebar.css"; // 스타일 파일
import { Box } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
//npm install react-icons
import { FaHouse, FaUser } from "react-icons/fa6";

// 메뉴 항목 데이터
export const menuItems = [
  { icon: <FaHouse />, label: "메인 화면", path: "/" },
  { icon: <FaUser />, label: "마이페이지", path: "/mypage" },
];

const Sidebar = () => {
  const location = useLocation(); // 현재 경로 가져오기

  return (
      <Box
          className="sidebar"
          width="60px" // 우측 사이드바의 폭
          display="flex"
          flexDirection="column"
          position="sticky"
          top="30%"
          margin="auto"
      >
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path; // 현재 경로와 메뉴 경로 비교
          return (
              <Link
                  to={item.path}
                  key={index}
                  style={{ textDecoration: "none" }}
              >
                <div
                    className={`sidebar-item ${isActive ? "active" : ""}`}
                >
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