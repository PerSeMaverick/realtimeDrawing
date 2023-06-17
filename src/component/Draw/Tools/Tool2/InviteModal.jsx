import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.css";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onHide} />;
};

const Invite = (props) => {
  let [participants, setParticipants] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:8080/participate", {
        body: { roomData: props.roomData },
      })
      .then((response) => {
        console.log(response.data);
        setParticipants([...response.data.member]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.roomData]);

  return (
    <div className={classes.modal}>
      <div>
        <h2>현재 참여중인 사람</h2>
        <div className={classes.content}>
          <div className={classes.users}>
            {participants.map((member, i) => {
              return (
                <div key={i} className={classes.user}>
                  {member}
                </div>
              );
            })}
          </div>
          <div className={classes.invite}>
            <input
              type="url"
              readOnly
              value={` ${props.path}`}
              className={classes.inviteLink}
            />
            <p>공유할 사람에게 링크를 보내주세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const portalElement = document.getElementById("overlays");

const InviteModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(<Backdrop onHide={props.onHide} />, portalElement)}
      {ReactDOM.createPortal(
        <Invite
          member={props.member}
          path={props.path}
          roomData={props.roomData}
        />,
        portalElement
      )}
    </>
  );
};

export default InviteModal;
