import { configureStore, createSlice } from "@reduxjs/toolkit";

let room = createSlice({
  name: "room",
  initialState: {
    myNickname: "",
  },
  reducers: {
    RoomInfo(state, action) {
      state = action.payload;
      console.log(state);
    },
  },
});

let member = createSlice({
  name: "member",
  initialState: {
    member: [],
  },
  reducers: {
    addMember(state, action) {},
    removeMember(state, action) {},
  },
});

let showMember = createSlice({
  name: "member",
  initialState: {
    showMemberModal: false,
    showExitModal: false,
  },
  reducers: {
    onShowMember(state) {
      if (state.showMemberModal === false) {
        state.showMemberModal = true;
      } else {
        state.showMemberModal = false;
      }
    },
    onShowExit(state) {
      if (state.showExitModal === false) {
        state.showExitModal = true;
      } else {
        state.showExitModal = false;
      }
    },
  },
});

export let { RoomInfo } = room.actions;
export let { addMember, removeMember } = member.actions;
export let { onShowMember, onShowExit } = showMember.actions;

export default configureStore({
  reducer: {
    room: room.reducer,
    member: member.reducer,
    showMember: showMember.reducer,
  },
});
