import React from "react";
import stylesChat from "./ChatInput.module.css"; // CSS 모듈 파일 import

const OpenChat = ({
  message,
  setMessage,
  handleSend,
  handleKeyDown,
  chats,
  currentMemberNo,
  nickname
}) => {
  return (
    <div className={stylesChat.container}>
      <div className={stylesChat.chatMessages}>
        {chats &&
          chats.map((c, index) => (
            <div
              key={index}
              className={`${stylesChat.chatMessage} ${
                c.memberNo !== currentMemberNo ? stylesChat.otheruser : stylesChat.currentUser
              }`}
            >
              {c.memberNo !== currentMemberNo ? `${c.nickname} : ` : ``} {c.content}
            </div>
          ))}
      </div>
      <div className={stylesChat.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요."
          className={stylesChat.inputField}
        />
        <button onClick={handleSend} className={stylesChat.sendButton}>
          전송
        </button>
      </div>
    </div>
  );
};

export default OpenChat;
