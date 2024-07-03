import { configureStore } from "@reduxjs/toolkit";
import dingTalkSlice from "./dingTalkSlice";
import dictionarySlice from "./dictionarySlice";

export default configureStore<Application.ReducerType>({
  reducer: {
    dingTalk: dingTalkSlice,
    dictionary: dictionarySlice,
  },
})