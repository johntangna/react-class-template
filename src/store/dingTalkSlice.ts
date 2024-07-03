import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DingUserResponse } from "../api/api";


const initialState: { dingTalk: DingUserResponse } = {
  dingTalk: {
    userId: "",
    dingName: "",
    belongPlate: [],
  },
}

export const dingTalkSlice = createSlice({
  name: "dingTalk",
  initialState,
  reducers: {
    setDingUser: (state, action: PayloadAction<DingUserResponse>) => {
      // alert(2)
      // alert(JSON.stringify(action.payload))
      state.dingTalk = {
        ...state.dingTalk,
        ...action.payload,
      }
    },
  },
})

export const { setDingUser } = dingTalkSlice.actions

export default dingTalkSlice.reducer