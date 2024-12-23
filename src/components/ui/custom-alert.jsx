import React from "react";

const CustomAlert = ({ status, title, message, onClose }) => {
  const alertStyles = {
    container: {
      position: "fixed",
      top: "10%", // 상단에서 약간 아래로 이동
      left: "50%",
      transform: "translateX(-50%)", // 수평으로 중앙 정렬
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
      zIndex: 9999,
      maxWidth: "400px",
      width: "100%",
    },
    header: {
      fontSize: "1.2em",
      fontWeight: "bold",
      color: status === "error" ? "red" : "green",
    },
    message: {
      fontSize: "1em",
      marginTop: "10px",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end", // 버튼을 오른쪽 정렬
      marginTop: "15px",
    },
    button: {
      padding: "8px 16px",
      backgroundColor: status === "error" ? "red" : "green",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  return (
    <div style={alertStyles.container}>
      <div style={alertStyles.header}>{title}</div>
      <div style={alertStyles.message}>{message}</div>
      <div style={alertStyles.buttonContainer}>
        <button style={alertStyles.button} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;
