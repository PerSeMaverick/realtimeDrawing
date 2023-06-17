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
