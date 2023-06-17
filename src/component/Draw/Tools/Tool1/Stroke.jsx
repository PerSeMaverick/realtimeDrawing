import React from "react";

import classes from "../Tools.module.css";

const Stroke = (props) => {
  return (
    <>
      <input
        type="range"
        min="1"
        max="30"
        defaultValue="1"
        className={classes.range}
        onChange={(e) => {
          props.onChangeStrokeWidth(e);
        }}
      />
    </>
  );
};

export default Stroke;
