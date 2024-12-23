import React, { useState } from "react";
import "./Sidebar.css"; // 스타일 파일
import { Box } from "@chakra-ui/react"
import {Link} from 'react-router-dom';
//npm install react-icons
import { FaAlignJustify , FaUser, FaBowlRice } from "react-icons/fa6";

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const menuItems = [
    { icon: <FaAlignJustify  />, label: "메인 화면", path:"/" },
    { icon: <FaUser />, label: "마이페이지", path:"/mypage"  },
    { icon: <FaBowlRice  />, label: "메뉴 추천", path:"/"  },
  ];

  return (
    <Box 
        className="sidebar"
        width="5vw" // 우측 사이드바의 폭
        height="30vh"
        display="flex"
        flexDirection="column"
        position="sticky"
        top="30%"
    >
      {menuItems.map((item, index) => (
        <Link
          to={item.path}
          key={index}
          style={{textDecoration:"none"}}
        >
        <div
          key={index}
          className={`sidebar-item ${activeIndex === index ? "active" : ""}`}
          onClick={() => setActiveIndex(index)}
        >
          <div className="icon">{item.icon}</div>
          <span className="label">{item.label}</span>
        </div>
        </Link>
      ))}
    </Box>
  );
};

export default Sidebar;
