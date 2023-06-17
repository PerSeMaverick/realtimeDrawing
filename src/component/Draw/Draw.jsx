import React, { useRef, useEffect } from "react";
import io from "socket.io-client"; // Client Socket
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Tools from "./Tools/Tools";
import Chat from "./Chat/Chat";
import InviteModal from "./Tools/Tool2/InviteModal";
import ExitModal from "./Tools/Tool2/ExitModal";

import { onShowMember, onShowExit } from "../../store/store";

import classes from "./Draw.module.css";

// import { useSelector } from "react-redux";

const CANVAS_WIDTH = 1100;
const CANVAS_HEIGHT = 770;

const Draw = () => {
  const canvasRef = useRef(null); // 1. useRef()를 사용하여 canvasRef라는 Ref 객체를 만들었다.
  const ctx = useRef(null);
  const isDrawing = useRef(false);
  // const colorsRef = useRef([]);
  const current = useRef({
    color: "black",
    lineWidth: 1,
  });
  let state = useSelector((state) => state.showMember);
  const dispatch = useDispatch();

  const socket = useRef(null);
  socket.current = io(); // 서버가 만들어 놓은 socket에 접속

  const location = useLocation();
  const roomData = location.state; // 전달된 데이터
  // console.log(roomData.navigate);
  const path = location.pathname;
  // console.log(roomData);
  socket.current.emit("joinroom", roomData.roomid);

  useEffect(() => {
    // 3. useEffect를 통해, 페이지가 렌더가 될때 canvas에 canvasRef라는 ref 객체의 .current라는 값 할당하였다.
    // 이제 canvas는 조작하려는 canvas 태그를 가리킨다.
    const canvas = canvasRef.current;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const context = canvas.getContext("2d");
    // console.log(context);
    context.strokeStyle = current.current.color;
    context.lineWidth = current.current.lineWidth;
    // console.log(contextRef.current);
    ctx.current = context;

    socket.current.on("imageUploaded", handleImageUpload);

    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 핸들러 정리, 메모리 누수 차단
      socket.current.off("imageUploaded", handleImageUpload);
      // socket.current.disconnect();
    };
  }, []);
  // console.log("ctx :", ctx);

  const handleImageUpload = (imageData) => {
    const image = new Image();
    image.src = imageData;
    image.onload = function () {
      ctx.current.drawImage(image, 50, 50, 300, 300);
    };
  };

  const onDrawingEvent = (data) => {
    drawing(data.x0, data.y0, data.x1, data.y1, data.color, data.lineWidth);
  };

  const drawing = (x0, y0, x1, y1, color, lineWidth, emit) => {
    if (!ctx.current) return;

    ctx.current.beginPath();
    ctx.current.moveTo(x0, y0);
    ctx.current.lineTo(x1, y1);
    ctx.current.strokeStyle = color;
    ctx.current.lineWidth = lineWidth;
    ctx.current.stroke();
    ctx.current.closePath();

    if (!emit) return;

    socket.current.emit("drawing", {
      x0: x0,
      y0: y0,
      x1: x1,
      y1: y1,
      color: color,
      lineWidth: lineWidth,
      roomNum: roomData.roomid,
    });
  };

  const onMouseDown = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    isDrawing.current = true;
    current.current.x = offsetX;
    current.current.y = offsetY;
  };
  const onMouseMove = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (!isDrawing.current) return;
    drawing(
      current.current.x,
      current.current.y,
      offsetX,
      offsetY,
      current.current.color,
      current.current.lineWidth,
      true
    );
    current.current.x = offsetX;
    current.current.y = offsetY;
  };
  const onMouseUp = () => {
    isDrawing.current = false;
  };

  const stationeryHandeler = (stationery) => {
    if (stationery === "pen") {
      current.current.color = "black";
    } else {
      current.current.color = "white";
    }
  };

  const changeStrokeWidth = (e) => {
    current.current.lineWidth = e.target.value;
  };

  const changeStrokeColor = (color) => {
    // console.log(color);
    current.current.color = `${color}`;
  };

  const onUploadFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    // 파일 읽기 완료 후 수행할 동작
    reader.onload = (event) => {
      const imageData = {
        image: event.target.result,
        roomNum: roomData.roomid,
      }; // 이미지 데이터
      socket.current.emit("uploadImage", imageData); // 서버로 이미지 데이터 전송
    };
    reader.readAsDataURL(file); // 파일 읽기 시작
  };

  const onDownload = () => {
    const url = canvasRef.current.toDataURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = "myDrawing.png";
    a.click();
  };

  const onHideMember = () => {
    dispatch(onShowMember());
  };
  const onHideExit = () => {
    dispatch(onShowExit());
  };

  socket.current.on("drawing", onDrawingEvent);

  return (
    <main className={classes.draw}>
      {state.showMemberModal === true ? (
        <InviteModal
          onHide={onHideMember}
          roomData={roomData}
          member={roomData.user}
          path={path}
        />
      ) : null}
      {state.showExitModal === true ? (
        <ExitModal onHide={onHideExit} roomData={roomData} />
      ) : null}
      {/* 2. 해당 객체를 DOM으로 조작하고 싶은 canvas 태그의 Ref 값으로 설정하였다. */}
      <canvas
        ref={canvasRef}
        className={classes.canvas}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      ></canvas>
      <aside className={classes.side}>
        <Tools
          onStationery={stationeryHandeler}
          onChangeStrokeWidth={changeStrokeWidth}
          onChangeStrokeColor={changeStrokeColor}
          onUploadFile={onUploadFile}
          onDownload={onDownload}
        />
        <Chat
          roomid={roomData.roomid}
          user={roomData.nickname}
          socket={socket.current}
        />
      </aside>
    </main>
  );
};

export default Draw;
