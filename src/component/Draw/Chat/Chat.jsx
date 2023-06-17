import React, { useRef, useEffect, useState, useCallback } from "react";

import classes from "./Chat.module.css";

const Chat = (props) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // 채팅 메시지들을 배열에 담아 상태로 관리
  const messageEndRef = useRef(null);

  const sender = props.user;
  // console.log(sender);

  const userSend = (e) => {
    setMessage(e.target.value);
  };

  const onSendMessage = () => {
    // 빈 채팅 보내는 것 막기
    if (message !== "") {
      props.socket.emit("chatting", {
        roomNum: props.roomid,
        message: message,
        sender: sender,
      });
    }
    setMessage(""); // 메시지 전송 후에 message 상태 초기화
  };

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      onSendMessage(); // Enter 입력이 되면 클릭 이벤트 실행
    }
  };

  const onAddMessage = useCallback((chatData) => {
    // console.log(chatData);
    setMessages((prevMessages) => [...prevMessages, chatData]);
  }, []);

  useEffect(() => {
    props.socket.on("chatting", onAddMessage);
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 핸들러 정리
      props.socket.off("chatting", onAddMessage);
    };
  }, [props.socket, onAddMessage, messages]);

  return (
    <div className={classes.chatbox}>
      <div className={classes.chatting}>
        <div className={classes.bubbles}>
          <div className={classes.warnnig}>
            다른 참여자에게 불쾌감을 줄 수 있는 비속어나 권리를 침해할 수 있는
            내용의 채팅은 금지됩니다. 건전한 채팅 공간을 위해 운영 정책을 지켜서
            활동해주세요.
          </div>
          {messages.map((chatData, i) => (
            <div
              key={chatData.roomNum + i}
              className={`${classes.bubble} ${
                chatData.sender === sender ? classes.bubbleMe : null
              }`}
            >
              <div style={{ fontSize: "2px" }}>{chatData.sender}</div>
              {chatData.message}
            </div>
          ))}
          <div ref={messageEndRef}></div>
        </div>
        <div className={classes.send}>
          <input
            id="chatting"
            type="text"
            placeholder=" 채팅을 입력하세요."
            value={message}
            onChange={userSend}
            onKeyUp={handleOnKeyPress}
          />
          <button onClick={onSendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
