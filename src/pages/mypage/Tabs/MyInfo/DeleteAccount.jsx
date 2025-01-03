import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { logout } from "../../../../redux/slices/authSlice";

const DeleteAccount = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await axios.post("/auth/logout");
      if (response.status === 200) {
        //alert("로그아웃 성공");
        dispatch(logout()); // 로그아웃
        navigate("/login");
      }
    } catch (error) {
      console.error("로그아웃 에러 : ", error);
      //alert("로그아웃 에러");
    }
  };

  const handleDeleteAccount = async (data) => {
    setLoading(true);
    //console.log("폼 데이터:", data);

    try {
        const response = await axios.delete("http://localhost:8080/main/mypage/members/delete", {
            data: {
              email: data.email,
              currentPassword: data.currentPassword,
              phone: data.phone,
            },
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
      //console.log("응답:", response.data);
      setResult({
        status: "success",
        title: "인증 성공",
        message: "그 동안 forklog를 이용해주셔서 감사드립니다.",
      });
      setTimeout(() => handleLogout(), 3000);
    } catch (error) {
      //console.error("회원 탈퇴 에러:", error);
      setResult({
        status: "error",
        title: "정보 불일치",
        message: "정보 불일치 : 입력하신 정보를 확인해주세요.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    reset();
    setResult(null);
  };

  const modalStyles = {
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalContent: {
      background: "white",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
      animation: "fadeIn 0.3s ease",
      width: "700px",
      maxWidth: "100%",
      height: "auto",
      textAlign: "left",
      position: "relative",
      top: "-50px",
      fontFamily: "'Arial', sans-serif",
    },
    button: {
      width: "auto",
      padding: "10px 20px",
      height: "40px",
      borderRadius: "8px",
      backgroundColor: "#ff6f00",
      color: "white",
      fontSize: "1em",
      border: "none",
      cursor: "pointer",
      marginBottom: "10px",
      transition: "background-color 0.3s ease",
    },
    buttonDisabled: {
      backgroundColor: "#ffcc80",
      cursor: "not-allowed",
    },
    cancelButton: {
      width: "auto",
      padding: "10px 20px",
      height: "40px",
      borderRadius: "8px",
      border: "2px solid lightgray",
      backgroundColor: "white",
      color: "black",
      fontSize: "1em",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    errorMessage: {
      color: "red",
      fontSize: "0.9em",
      marginTop: "-15px",
    },
    modalTitle: {
      marginBottom: "5px",
      fontSize: "1.5em",
    },
    inputField: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      marginBottom: "15px",
      fontSize: "1em",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      width: "100%",
    },
    resultMessage: {
      color: result?.status === "error" ? "red" : "orange",
      fontSize: "1em",
      marginLeft: "15px",
      display: "flex",
      alignItems: "center",
    },
  };

  return (
    <>
      <Button
        colorPalette="orange"
        onClick={() => setModalOpen(true)}
        size="lg"
      >
        회원 탈퇴
      </Button>

      {isModalOpen && (
        <div style={modalStyles.modal} onClick={() => setModalOpen(false)}>
          <div
            style={modalStyles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h1 style={modalStyles.modalTitle}>
              정말 탈퇴하시겠습니까?
            </h1>
            <b>사용자 정보를 입력해주세요.</b>
            <div>
              <label>이메일</label>
              <input
                type="email"
                placeholder="가입하신 계정의 이메일을 입력해주세요."
                {...register("email", {
                  required: "이메일은 필수 입력입니다.",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "올바른 이메일 형식으로 입력해주세요.",
                  },
                })}
                style={modalStyles.inputField}
              />
              {errors.email && (
                <p style={modalStyles.errorMessage}>{errors.email.message}</p>
              )}
            </div>
            <div>
              <label>비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호를 입력해주세요."
                {...register("currentPassword", {
                  required: "비밀번호는 필수 입력입니다.",
                  pattern: {
                    value:
                      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/,
                    message:
                      "비밀번호는 최소 8자 이상 최대 20자 이하, 숫자, 특수문자, 영문자가 포함되어야 합니다.",
                  },
                })}
                style={modalStyles.inputField}
              />
              {errors.phone && (
                <p style={modalStyles.errorMessage}>{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label>휴대전화</label>
              <input
                type="text"
                placeholder="'-'를 제외한 숫자 11자리를 입력해주세요."
                {...register("phone", {
                  required: "휴대전화는 필수 입력입니다.",
                  pattern: {
                    value: /^[0-9]{11}$/,
                    message: "'-'를 제외한 숫자 11자리를 입력해주세요.",
                  },
                })}
                style={modalStyles.inputField}
              />
              {errors.phone && (
                <p style={modalStyles.errorMessage}>{errors.phone.message}</p>
              )}
            </div>
            <div style={modalStyles.buttonContainer}>
              {result && (
                <div style={modalStyles.resultMessage}>{result.message}</div>
              )}
              <button
                type="button"
                style={
                  isLoading ? modalStyles.buttonDisabled : modalStyles.button
                }
                disabled={isLoading}
                onClick={handleSubmit(handleDeleteAccount)}
              >
                {isLoading ? "처리 중..." : "탈퇴하기"}
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                style={modalStyles.cancelButton}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAccount;
