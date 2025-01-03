import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const FindPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFindPassword = async (data) => {
    setLoading(true);
    //console.log("폼 데이터:", data);

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/find-password",
        data
      );
      //console.log("응답:", response.data);
      setResult({
        status: "success",
        title: "인증 성공",
        message: "인증 성공 : 이메일을 확인해주세요.",
      });
    } catch (error) {
      if (error.response) {
        const status = error.response.status;

        switch (status) {
          case 400: // BAD_REQUEST
            setResult({
              status: "error",
              title: "정보 불일치",
              message: error.response.data, // 서버에서 제공한 메시지
            });
            break;

          case 403: // FORBIDDEN
            setResult({
              status: "error",
              title: "계정 비활성화",
              message: error.response.data, // 비활성화 계정 메시지
            });
            break;

          case 404: // NOT_FOUND
            setResult({
              status: "error",
              title: "사용자 없음",
              message: error.response.data, // 등록된 사용자가 없음
            });
            break;

          default:
            setResult({
              status: "error",
              title: "오류 발생",
              message: "알 수 없는 오류가 발생했습니다.",
            });
        }
      } else {
        setResult({
          status: "error",
          title: "서버 연결 실패",
          message: "서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
        });
      }
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
      marginBottom: "20px",
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
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        style={{ fontSize: "0.9em" }}
      >
        비밀번호 찾기
      </button>

      {isModalOpen && (
        <div style={modalStyles.modal} onClick={() => setModalOpen(false)}>
          <div
            style={modalStyles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={modalStyles.modalTitle}>비밀번호 찾기</h2>
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
                onClick={handleSubmit(handleFindPassword)}
              >
                {isLoading ? "처리 중..." : "비밀번호 찾기"}
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                style={modalStyles.cancelButton}
              >
                나가기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FindPassword;
