import React from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import classes from "./Modal.module.css";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onHide} />;
};

const Exit = (props) => {
  const navigate = useNavigate();

  const onExitRoom = async () => {
    axios
      .post("http://localhost:8080/exit", {
        body: {
          drawid: props.roomData.roomid,
          nickname: props.roomData.nickname,
        },
      })
      .then((response) => {
        console.log("exit 요청성공", response.data);
        document.body.style.backgroundColor = "white";
        navigate("/", { replace: true }); // 뒤로가기 막기
      })
      .catch((error) => {
        console.log("exit 요청실패");
        console.log(error);
      });
  };

  return (
    <div className={classes.modal}>
      <div>
        <h2>방을 나가시겠습니까?</h2>
        <div>
          <button type="button" className={classes.btns} onClick={onExitRoom}>
            나가기
          </button>
          or
          <button type="button" className={classes.btns} onClick={props.onHide}>
            더 놀다가기
          </button>
        </div>
      </div>
    </div>
  );
};

const portalElement = document.getElementById("overlays");

const ExitModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(<Backdrop onHide={props.onHide} />, portalElement)}
      {ReactDOM.createPortal(
        <Exit onHide={props.onHide} roomData={props.roomData} />,
        portalElement
      )}
    </>
  );
};

export default ExitModal;
