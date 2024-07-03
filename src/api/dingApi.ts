import { AxiosRequestConfig } from "axios"
import HttpService from "../utils/request"
import { DingApiResponse, DingUserResponse } from "./api"

export const getCoprId = () => {
  return HttpService.get<AxiosRequestConfig, DingApiResponse>('/oauth/ticket')
}

export const getUserByCode = (params: Record<"code", string>) => {
  return HttpService.get<AxiosRequestConfig, DingUserResponse>('/oauth/code', {
    params: params,
  })
}