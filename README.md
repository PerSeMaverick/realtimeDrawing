# Realtime Drawing

<p align="center">
  <br>
    <img width="759" alt="스크린샷 2023-08-17 20 26 13" src="https://github.com/PerSeMaverick/realtimeDrawing/assets/104728148/cf8f0452-040d-4939-b38b-d22e5bdc3afb">
    <img width="759" alt="스크린샷 2023-09-01 10 50 56" src="https://github.com/PerSeMaverick/realtimeDrawing/assets/104728148/3d5b5a48-e42c-4724-a946-86697876554b">
</p>
<p align="center">
  GIF Images
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

![project6아키텍쳐](https://github.com/PerSeMaverick/realtimeDrawing/assets/104728148/d71a7348-5020-4f26-9912-ba6e1a780dd5)


## 구현 기능

### 기능 1 - 방 생성, 참가
https://github.com/PerSeMaverick/realtimeDrawing/assets/104728148/f71cace2-f84b-4348-adc1-27f558dd35ae

<br>

### 기능 2 - 실시간 그림 공유 기능, 그림 도구(색, 지우개, 두께, 사진 업로드, 저장)
https://github.com/PerSeMaverick/realtimeDrawing/assets/104728148/fdbf0394-70ee-4ca4-bf59-845f69ec99e9

https://github.com/PerSeMaverick/realtimeDrawing/assets/104728148/d6e5891e-bfeb-428a-b159-6d7ce6bb9864

<br>

### 기능 3 - 채팅
https://github.com/PerSeMaverick/realtimeDrawing/assets/104728148/9a0624b2-9c30-4a3d-b09a-1a824379181d


<br>

## 배운 점 & 아쉬운 점

<p align="justify">
  1. CORS에러에 대해 좀 더 확실히 공부해야겠다고 느꼈음.<br>
  2. 아직 CSS가 익숙하지 않아 반응형으로 만들지 못했다. CSS공부를 한참은 더 해야한다.<br>
  3. 채팅시 스크롤이 자동으로 마지막 메세지를 보여주는 것은 CSS만으로 안된다는 것을 몰랐었는데 새로알게 됨.<br>
  4. 유저 두명이서 그림을 공유하는데 버벅임이 살짝 있었다. 트래픽이 매우많은 서비스들은 어떻게 하는지 공부해봐야겠음.<br>
  5. 리엑트는 쉬운 듯 하면서도 아렵다. 조금만 복잡해지면 뒤엉켜버려서 파일 정리나 주석 처리를 반드시 해놓아야 한다. 미래의 나를 위해서라도
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
