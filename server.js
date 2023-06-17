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
  "mongodb+srv://admin:mm1166911@mucham.f69xhd2.mongodb.net/?retryWrites=true&w=majority",
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

app.post("/exit", (req, res) => {
  resived = req.body.body;
  console.log("line102", resived);
  db.collection("drawroom").findOne(
    { roomid: resived.drawid },
    (err, result) => {
      if (err) return console.log(err);
      console.log("exit result", result);
      if (result) {
        let remainMember = result.member;
        let Participants = remainMember.filter((member) => {
          return member !== resived.nickname;
        });
        console.log("나간 후 참가자", Participants);
        db.collection("drawroom").updateOne(
          { roomid: resived.drawid },
          { $set: { member: Participants } },
          (err, result) => {
            if (err) return console.log(err);
            console.log("line 114 방 나가기 완료", result);
            // res.send(result);
            if (Participants.length === 0) {
              db.collection("drawroom").deleteOne(
                { roomid: resived.drawid },
                (err, result) => {
                  if (err) return console.log(err);
                  console.log("삭제완료", result);
                  res.send(result);
                }
              );
            }
          }
        );
      }
    }
  );
});

app.post("/participate", (req, res) => {
  resived = req.body.body;
  console.log("line140", resived);
  db.collection("drawroom").findOne(
    { roomid: resived.roomData.roomid },
    (err, result) => {
      if (err) return console.log(err);
      console.log("participate result", result);
      if (result) {
        res.send(result);
      }
    }
  );
});

io.on("connection", (socket) => {
  socket.on("joinroom", (data) => {
    console.log("line134 방 참가 되었어요", data);
    socket.join(`${data}`);
  });
  socket.on("drawing", (data) => {
    // 현재 소켓을 제외한 모든 연결된 클라이언트에게 이벤트와 데이터를 전송
    // 그림을 그리는 나는 내가 그리는 그림을 중복해서 볼 필요없음
    // socket.broadcast.emit("drawing", data);
    io.to(`${data.roomNum}`).emit("drawing", data);
  });
  socket.on("uploadImage", (imageData) => {
    // 나 포함 모든 클라이언트에게 이미지 데이터 전송
    // 나도 공유되는 이미지가 보여야한다.
    io.to(`${imageData.roomNum}`).emit("imageUploaded", imageData.image);
  });
  socket.on("chatting", (chatData) => {
    console.log(chatData);
    // 받은 메세지 전송
    io.to(`${chatData.roomNum}`).emit("chatting", chatData);
  });
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html")); // build전에 경로는 어떻게 해야하는가?
});
