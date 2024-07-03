import { AxiosRequestConfig } from "axios"
import { QueryParams } from "../pages/TraceRecord"
import { Data } from "../pages/TraceRecord/TraceRecordAction"
import HttpService from "../utils/request"
import { Reponse } from "./api"

export const queryTraceRecord = (params: QueryParams) => {
  return HttpService.get<AxiosRequestConfig, Reponse>("/supplierFollowRecord/", {
    params: params,
  })
}

export const voidTraceRecoid = (data: Record<"ids", string[]>) => {
  return HttpService.post("/supplierFollowRecord/operationStatus", {
    data: data,
  })
}

export const createTraceRecoid = (data: FormData) => {
  return HttpService.post("/supplierFollowRecord", {
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}