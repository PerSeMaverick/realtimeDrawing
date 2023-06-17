// 초대받은 사람이 보는 페이지

import style from "styled-components";
import classes from "./begin.module.css";

import TextField from "@mui/material/TextField";

const FormText = style.p`
  font-size : 17px;
  font-weight: bolder;
`;

const Invited = () => {
  return (
    <main>
      <div style={{ fontSize: "10em" }}>R.T.D</div>
      <h1>Share Your Drawing!</h1>
      <div>
        <form action="/add" method="POST">
          <div className={classes.split}>
            <FormText>그림판에서 사용할 이름을 설정하세요.</FormText>
            <TextField
              name="nickname"
              id="outlined-basic"
              label="닉네임 설정"
              variant="outlined"
            />
          </div>
        </form>
      </div>
    </main>
  );
};

export default Invited;
