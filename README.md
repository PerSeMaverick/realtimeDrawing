# Realtime Drawing

<p align="center">
  <br>
    <img width="759" alt="스크린샷 2023-08-17 20 26 13" src="https://github.com/PerSeMaverick/realtimeDrawing/assets/104728148/cf8f0452-040d-4939-b38b-d22e5bdc3afb">
    <img width="759" alt="스크린샷 2023-09-01 10 50 56" src="https://github.com/PerSeMaverick/realtimeDrawing/assets/104728148/3d5b5a48-e42c-4724-a946-86697876554b">
</p>

## 프로젝트 소개

<p align="justify">
프로젝트 개요/동기<br>
NodeJS 강의 수강 완료 후 앞서 배운 것들을(HTML, CSS, JS, React, NodeJS(express), mongoDB) 활용해보고<br>
canvas, 마우스 위치 이벤트, express라이브러리, socket.io, mongoDB 기술들을 익히기 위해 시작.

~~~
💡 컴포넌트 설계
App컴포넌트(다크모드 지원)
- 방입장 컴포넌트(React, NodeJS, Express, MongoDB)
    - 유저이름
    - 방id
    - 방입장, 방 만들기(react router)
- 그림판 컴포넌트
    - 그림판(socket.io)
    - 그림도구 컴포넌트
        - 펜, 지우개, 펜 두께, 색 고르기
        - 사진 업로드(사진 위에 그림 가능)
        - 그림 저장, 방 나가기
    - 채팅 컴포넌트
        - 유저 채팅(socket.io)
        - 접속중인 유저, 유저 수 표시
~~~
~~~
🛠 기능 설계
첫 시작화면은 항상 방 입장(start) 컴포넌트여야한다. 
유저가 새로운 방을 생성할 수 있기 때문이다.

    💡방 생성, 참가
    "방 생성하기" 버튼으로 form 제출 후(fe)
    - 제출된 id를 가진 방이 존재하는지 확인
        - 방 id가 중복되는 경우 아이디 다시 입력
        - 해당 id가 존재하지 않으면(server,db) ⇒ 해당 id로 새로운 방 생성, 닉네임 저장(db, fe).
    "방 참가하기" 버튼으로 form 제출 후(fe)
    - 입력한 방 id가 존재할 경우(server,db) ⇒ 해당 방으로 입장(fe).
    - 해당 id가 존재하지 않으면(server,db) ⇒ 아이디 다시 입력

- 방에 있던 유저가 모두 나가면 방은 사라짐
- 서버, DB에서 확인 후 리액트에서 라우팅
- DB에 유저정보(이름), 방 정보(방id, 방 접속 유저) 저장

- 그림도구 컴포넌트
    - 펜, 지우개, 펜 두께, 색 고르기
    - 사진 업로드(사진 위에 그림 가능)
    - 그림 저장, 방 나가기
- 채팅 컴포넌트
    - 유저 채팅(socket.io)
    - 접속중인 유저, 유저 수 표시
~~~
</p>

<br>

## 사용 기술 스택

|   Html  |  CSS   | JavaScript |   React   |   Node  |    MongoDB   |
| :-----: | :----: | :--------: |  :------: | :-----: |    :-----:   |
| ![html] | ![css] |   ![js]    |  ![react] | ![node] |  ![mongodb]  |

<br>

<p align="center">
  
  <img src = "https://github.com/PerSeMaverick/realtimeDrawing/assets/104728148/d71a7348-5020-4f26-9912-ba6e1a780dd5"/>

</p>


## 구현 기능

### 기능 1 - 방 생성, 참가
https://github.com/PerSeMaverick/realtimeDrawing/assets/104728148/f71cace2-f84b-4348-adc1-27f558dd35ae

<details>
<summary>클라이언트 코드</summary>
<div markdown="1">

```javascript
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
import axios from "axios";

// import { RoomInfo } from "../store/store";

import style from "styled-components";
import classes from "./begin.module.css";

import TextField from "@mui/material/TextField";

const FormText = style.p`
  font-size : 17px;
  font-weight: bolder;
`;

const Start = () => {
  let [enteredDrawid, setEnteredDrawid] = useState("");
  let [enteredNickname, setEnteredNickname] = useState("");
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    const identifier = setTimeout(() => {
      // console.log("checking validity");
      setFormIsValid(
        enteredDrawid.trim().length > 3 && enteredNickname.trim().length > 0
      );
    }, 300);
    return () => {
      // console.log("cleanUp");
      clearTimeout(identifier);
    };
  }, [enteredDrawid, enteredNickname]);

  // let dispatch = useDispatch();
  const navigate = useNavigate();

  const nicknameHandler = (e) => {
    setEnteredNickname(e.target.value);
  };
  const drawidHandler = (e) => {
    setEnteredDrawid(e.target.value);
  };

  // 방 참가하기
  const joinRoomHandler = async () => {
    axios
      .post("http://localhost:8080/join", {
        body: {
          drawid: enteredDrawid,
          nickname: enteredNickname,
        },
      })
      .then((response) => {
        console.log("join 요청성공");
        // 여기가 ""이면 입력한 id로 된 방 없음, 있으면 해당 정보 store에 dispatch
        // console.log(response.data);
        if (response.data === "") {
          alert("해당 ID로 된 방이 없습니다. 방을 새로 생성하세요.");
        } else {
          console.log("join", response.data);
          // dispatch(RoomInfo(enteredNickname));
          const roomData = {
            roomid: response.data.roomid,
            user: response.data.member,
            nickname: enteredNickname,
            // navigate: navigate,
          }; // 전달할 데이터
          navigate("/draw", { state: roomData, replace: true });
        }
      })
      .catch((error) => {
        console.log("join 요청실패");
        console.log(error);
      });
  };

  // 방 생성하기
  const createRoomHandler = async () => {
    axios
      .post("http://localhost:8080/create", {
        body: {
          drawid: enteredDrawid,
          nickname: enteredNickname,
        },
      })
      .then((response) => {
        console.log("create 요청성공");
        // 여기서 이미 해당 id로 존재하는지 구별 해야함.
        // 없는 방 만들때 == response.data.insertedId
        // 이미 존재하는 방일때 == response.data.roomid
        // console.log("create", response.data);
        if (response.data === "") {
          alert("해당 ID로 된 방이 이미 존재합니다. 다른 ID로 생성해 주세요.");
        } else {
          console.log("create", response.data);
          // dispatch(RoomInfo(enteredNickname));
          const roomData = {
            roomid: response.data.roomid,
            user: response.data.member,
            nickname: enteredNickname,
            // navigate: navigate,
          }; // 전달할 데이터
          navigate("/draw", { state: roomData, replace: true });
        }
      })
      .catch((error) => {
        console.log("create 요청실패");
        console.log(error);
      });
  };

  return (
    <div className={classes.contain}>
      <main className={classes.main}>
        <div style={{ fontSize: "10em" }}>R.T.D</div>
        <h1>Share Your Real Time Drawing!</h1>
        <div>
          <form>
            <div className={classes.split}>
              <FormText>그림판에서 사용할 이름을 설정하세요.</FormText>
              <TextField
                type="text"
                variant="outlined"
                label="닉네임 설정(한 글자 이상)"
                name="nickname"
                onChange={nicknameHandler}
              />
            </div>
            <div className={classes.split}>
              <FormText>그림판 ID를 입력하세요.</FormText>
              <TextField
                type="text"
                variant="outlined"
                label="그림판 ID(네 글자 이상)"
                name="drawid"
                onChange={drawidHandler}
              />
            </div>
            <div className="form3">
              <FormText>
                해당 ID를 가진 새로운 방을 만들거나 참가하세요.
              </FormText>
              <button
                className={classes.btns}
                type="button"
                onClick={joinRoomHandler}
                disabled={!formIsValid}
              >
                방 참가하기
              </button>
              or
              <button
                className={classes.btns}
                type="button"
                onClick={createRoomHandler}
                disabled={!formIsValid}
              >
                방 생성하기
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Start;

```

</details>

<details>
<summary>서버 코드</summary>
<div markdown="1">

```javascript
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http").createServer(app);
const { Server } = require("socket.io");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000", // 허용할 도메인 주소
    methods: ["GET", "POST"], // 허용할 HTTP 메서드
  },
});

const MongoClient = require("mongodb").MongoClient;

let db; // db 저장할 변수하나 필요
MongoClient.connect(
  "mongodbID",
  (error, client) => {
    if (error) return console.log(error); // 에러있으면 출력

    db = client.db("drawapp"); // drawapp db로 연결

    app.post("/create", (req, res) => {
      // /create로 접속시
      console.log("line22", req.body.body); // 받은 form 데이터
      let resived = req.body.body;
      // 제출된 id를 가진 방이 존재하는지 확인
      db.collection("drawroom").findOne(
        { roomid: resived.drawid },
        (err, result) => {
          if (result) {
            res.send(); // 해당 아이디로 생성된 방이 있다면 프론트에서 아이디 다시 입력
          } else {
            db.collection("drawroom").insertOne(
              // drawroom collection에 insertOne{ 자료 }
              { roomid: resived.drawid, member: [resived.nickname] }, // 해당 아이디로 된 방이 없으면 새로만들기
              (error, result) => {
                if (error) return console.log(error);
                // console.log("line 31 저장완료", result);
                db.collection("drawroom").findOne(
                  { roomid: resived.drawid },
                  (err, result) => {
                    res.send(result); // 만든방 정보 넘겨주기
                  }
                );
              }
            );
          }
        }
      );
    });
    // .listen 으로 서버를 열 수 있다.
    http.listen(8080, () => {
      console.log("listening on 8080");
    });
  }
);

app.post("/join", (req, res) => {
  // join으로 접속시
  resived = req.body.body;
  console.log("line52", resived); // 받은 form 데이터
  db.collection("drawroom").findOne(
    // 입력한 방 id과 같은 이름 찾아서
    { roomid: resived.drawid },
    (err, result) => {
      console.log("line59", result);
      if (result) {
        let Participants = [...result.member, resived.nickname]; // 해당 방의 맴버로 추가해주기
        db.collection("drawroom").updateOne(
          // DB 데이터 member 수정
          // drawroom collection에 updateOne
          { roomid: resived.drawid },
          { $set: { member: Participants } },
          (error, result) => {
            if (error) return console.log(error);
            console.log("line 64 참가완료", result);
            db.collection("drawroom").findOne(
              { roomid: resived.drawid },
              (err, result) => {
                res.send(result); // 만든방 정보 넘겨주기
              }
            );
          }
        );
      } else {
        // 입력한 방 id가 없다면?
        res.send(result);
      }
    }
  );
});

```

</details>

<br>

### 기능 2 - 실시간 그림 공유 기능, 그림 도구(색, 지우개, 두께, 사진 업로드, 저장)
https://github.com/PerSeMaverick/realtimeDrawing/assets/104728148/fdbf0394-70ee-4ca4-bf59-845f69ec99e9

<details>
<summary>그리기, 공유 코드</summary>
<div markdown="1">

```javascript
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

```

</details>

https://github.com/PerSeMaverick/realtimeDrawing/assets/104728148/d6e5891e-bfeb-428a-b159-6d7ce6bb9864

<details>
<summary>도구 코드</summary>
<div markdown="1">

```javascript
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

```

</details>

<br>

### 기능 3 - 채팅
https://github.com/PerSeMaverick/realtimeDrawing/assets/104728148/9a0624b2-9c30-4a3d-b09a-1a824379181d

<details>
<summary>채팅 코드</summary>
<div markdown="1">

```javascript
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

```

</details>

<br>

## 배운 점 & 아쉬운 점

<p align="justify">
  1. 아직 CSS가 익숙하지 않아 반응형으로 만들지 못했다. CSS공부를 한참은 더 해야한다.(flex, grid를 이용한 반응형 웹 페이지)<br>
  2. 채팅시 스크롤이 자동으로 마지막 메세지를 보여주는 것은 CSS만으로 안된다는 것을 몰랐었는데 새로알게 됨.(scrollIntoView() 함수)<br>
  3. 유저 두명이서 그림을 공유하는데 버벅임이 살짝 있었다. 트래픽이 매우 많은 서비스들은 어떻게 하는지 공부해봐야겠음.<br>
  4. 리엑트는 조금만 복잡해지면 뒤엉켜 버려서 미래의 나를 위해서라도 파일 정리나 주석 처리를 반드시 해놓아야 한다. 
</p>

<br>

## 외부 리소스, 라이브러리 정보
Express<br>
Socket.io<br>
Redux/toolkit<br>
axios<br>
styled-component<br>
Mui

<!-- ## 라이센스

MIT &copy; [NoHack](mailto:lbjp114@gmail.com)
-->

<!-- Stack Icon Refernces -->

[html]: /icon/html.svg
[css]: /icon/css.svg
[js]: /icon/javascript.svg
[react]: /icon/react.svg
[node]: /icon/node.svg
[mongodb]: /icon/mongodb.svg
