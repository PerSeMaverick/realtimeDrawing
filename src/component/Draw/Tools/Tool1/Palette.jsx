import React from "react";
import { flushSync } from "react-dom";
import { SwatchesPicker } from "react-color";

import classes from "../Tools.module.css";

const Palette = (props) => {
  const handleChangeComplete = (selectedColor) => {
    flushSync(() => {
      props.onChangeStrokeColor(selectedColor.hex);
      document.body.style.backgroundColor = selectedColor.hex;
    });
  };

  return (
    <div className={classes.colorPicker}>
      <SwatchesPicker onChangeComplete={handleChangeComplete} />
    </div>
  );
};

export default Palette;
