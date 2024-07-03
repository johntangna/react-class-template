import { AxiosRequestConfig } from "axios"
import HttpService from "../utils/request"
import { DetailsData } from "../component/InfoCom"
import { AccountData } from "../pages/TeamPool/Account"
import { RecordData } from "../component/ModifyRecord"
import FileData, { QueryParams } from "../pages/TeamPool/FileData"
import { Reponse } from "./api"

export const queryFileDataList = (params: QueryParams) => {
  return HttpService.get<AxiosRequestConfig, Reponse>(`/supplierSpec/`, {
    params: params,
  })
}

export const queryFileDataDetailsById = (id: number) => {
  return HttpService.get<AxiosRequestConfig, DetailsData[]>(`/supplierSpec/${id}`)
}

export const updatFileDataDetails = (id: number, data: DetailsData[]) => {
  return HttpService.request('patch', `/supplierSpec/${id}`, {
    data: data,
  })
}

export const fileDataMapping = () => {
  return HttpService.get<AxiosRequestConfig, DetailsData[]>('/supplierSpec/mapping')
}

export const insertFileData = (data: DetailsData[]) => {
  return HttpService.post<AxiosRequestConfig, DetailsData[]>('/supplierSpec', {
    data: data,
  })
}

export const queryRecord = (id: number) => {
  return HttpService.get<AxiosRequestConfig, RecordData[]>(`/supplierSpec/${id}/queryRecord`)
}