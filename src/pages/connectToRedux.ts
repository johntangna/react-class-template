import { ComponentType, ReactNode } from "react";
import { connect } from "react-redux";
import { setDingUser } from "../store/dingTalkSlice";
import { Action, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { DingUserResponse } from "../api/api";

export function connectToRedux(WrappedComponent: any) {

  const mapStateToProps = (state: Application.ReducerType) => ({
    userId: state.dingTalk.dingTalk.userId,
    dingName: state.dingTalk.dingTalk.dingName,
    belongPlate: state.dingTalk.dingTalk.belongPlate,
    plateOptions: state.dictionary.plateOptions,
  });

  const mapDispatchToProps = (dispatch: Dispatch<Action<string>>) => ({
    setDingUser: (payload: DingUserResponse) => dispatch(setDingUser(payload)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent)
}