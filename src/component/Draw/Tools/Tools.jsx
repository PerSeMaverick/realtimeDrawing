import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { onShowMember, onShowExit } from "../../../store/store";

import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined"; //pen
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh"; // eraser
import HorizontalSplitIcon from "@mui/icons-material/HorizontalSplit"; // stroke
import ColorLensIcon from "@mui/icons-material/ColorLens"; // palette

import UploadIcon from "@mui/icons-material/Upload"; // upload
import DownloadIcon from "@mui/icons-material/Download"; // download
import CoPresentIcon from "@mui/icons-material/CoPresent"; // invite
import LogoutIcon from "@mui/icons-material/Logout"; // exit

import Tooltip from "@mui/material/Tooltip";

import Stroke from "./Tool1/Stroke";
import Palette from "./Tool1/Palette";
import classes from "./Tools.module.css";

// css로 active된 효과를 다른 버튼이 눌릴때까지 유지

const Tools = (props) => {
  const [activeButton, setActiveButton] = useState(null);
  const [lineWidth, setLineWidth] = useState(false);
  const [chooseColor, setChooseColor] = useState(false);
  const dispatch = useDispatch();

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
    if (buttonId !== "stroke") {
      setLineWidth(false);
    }
    if (buttonId !== "palette") {
      setChooseColor(false);
    }
    if (buttonId === "invite") {
      dispatch(onShowMember());
    }
    if (buttonId === "exit") {
      dispatch(onShowExit());
    }
  };

  const lineWidthToggle = () => {
    if (!lineWidth) {
      setLineWidth(true);
    } else {
      setLineWidth(false);
    }
  };
  const chooseColorToggle = () => {
    if (!chooseColor) {
      setChooseColor(true);
    } else {
      setChooseColor(false);
    }
  };

  return (
    <nav className={classes.toolbox}>
      <h2>친구와 그림을 공유하세요!</h2>
      <section className={classes.tools}>
        <div
          className={`${classes.parts} ${
            activeButton === "pen" ? classes.selected : null
          }`}
          onClick={() => {
            handleButtonClick("pen");
            props.onStationery("pen");
          }}
        >
          <Tooltip title="펜" arrow placement="top">
            <BorderColorOutlinedIcon sx={{ fontSize: 45 }} />
          </Tooltip>
        </div>
        <div
          className={`${classes.parts} ${
            activeButton === "eraser" ? classes.selected : null
          }`}
          onClick={() => {
            handleButtonClick("eraser");
            props.onStationery("eraser");
          }}
        >
          <Tooltip title="지우개" arrow placement="top">
            <AutoFixHighIcon sx={{ fontSize: 45 }} />
          </Tooltip>
        </div>
        <div
          className={`${classes.parts} ${
            activeButton === "stroke" ? classes.selected : null
          }`}
          onClick={() => {
            handleButtonClick("stroke");
            lineWidthToggle();
          }}
        >
          <Tooltip title="선 굵기" arrow placement="top">
            <HorizontalSplitIcon sx={{ fontSize: 45 }} />
          </Tooltip>
        </div>
        {lineWidth ? (
          <Stroke onChangeStrokeWidth={props.onChangeStrokeWidth} />
        ) : (
          false
        )}
        <div
          className={`${classes.parts} ${
            activeButton === "palette" ? classes.selected : null
          }`}
          onClick={() => {
            handleButtonClick("palette");
            chooseColorToggle();
          }}
        >
          <Tooltip title="색 고르기" arrow placement="top">
            <ColorLensIcon sx={{ fontSize: 45 }}></ColorLensIcon>
          </Tooltip>
        </div>
        {chooseColor ? (
          <Palette onChangeStrokeColor={props.onChangeStrokeColor} />
        ) : (
          false
        )}
      </section>
      <section className={classes.tools}>
        <label
          htmlFor="input-file"
          className={`${classes.parts} ${
            activeButton === "upload" ? classes.selected : null
          }`}
          onClick={() => {
            handleButtonClick("upload");
          }}
        >
          <Tooltip title="사진 업로드" arrow placement="bottom">
            <UploadIcon sx={{ fontSize: 45 }} />
          </Tooltip>
          <input
            id="input-file"
            hidden
            type="file"
            accept="image/*"
            onChange={props.onUploadFile}
          />
        </label>
        <div
          className={`${classes.parts} ${
            activeButton === "download" ? classes.selected : null
          }`}
          onClick={() => {
            handleButtonClick("download");
            props.onDownload();
          }}
        >
          <Tooltip title="그림다운로드" arrow placement="bottom">
            <DownloadIcon sx={{ fontSize: 45 }} />
          </Tooltip>
        </div>
        <div
          className={`${classes.parts} ${
            activeButton === "invite" ? classes.selected : null
          }`}
          onClick={() => {
            handleButtonClick("invite");
          }}
        >
          <Tooltip title="멤버" arrow placement="bottom">
            <CoPresentIcon sx={{ fontSize: 45 }} />
          </Tooltip>
        </div>
        <div
          className={`${classes.parts} ${
            activeButton === "exit" ? classes.selected : null
          }`}
          onClick={() => {
            handleButtonClick("exit");
          }}
        >
          <Tooltip title="방 나가기" arrow placement="bottom">
            <LogoutIcon sx={{ fontSize: 45 }} />
          </Tooltip>
        </div>
      </section>
    </nav>
  );
};

export default Tools;
