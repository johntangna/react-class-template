import { AxiosRequestConfig } from "axios"
import { QueryParams } from "../pages/TeamPool"
import HttpService from "../utils/request"
import { Reponse } from "./api"
import { DetailsData, Options } from "../component/InfoCom"
import { RecordData } from "../component/ModifyRecord"

export const queryTeamPool = (params: QueryParams) => {
  return HttpService.get<AxiosRequestConfig, Reponse>("/supplier/", {
    params: params,
  })
}

export const queryTeamPoolDetailsById = (id: number) => {
  return HttpService.get<AxiosRequestConfig, DetailsData[]>(`/supplier/${id}`)
}

export const updateTeamPoolDetailsDataById = (id: number, data: DetailsData[]) => {
  return HttpService.request('patch', `/supplier/${id}`, {
    data: data,
  })
}

export const insertTeamPoolDetailsDataById = (data: DetailsData[]) => {
  return HttpService.request('post', `/supplier`, {
    data: data,
  })
}

export const teamPoolMapping = () => {
  return HttpService.get<AxiosRequestConfig, DetailsData[]>('/supplier/mapping')
}

export const accept = (id: number) => {
  return HttpService.post(`/supplier/${id}/followup`)
}

export const unAccept = (id: number) => {
  return HttpService.post(`/supplier/${id}/cancel`)
}

export const pointOrBlack = (id: number, data: Record<"type", "SUPPLIER_POINT" | "SUPPLIER_BLACK" | "SUPPLIER_PUBLIC">) => {
  return HttpService.post(`/supplier/${id}/change`, {
    data: data,
  })
}

export const modifyRecord = (id: number) => {
  return HttpService.get<AxiosRequestConfig, RecordData[]>(`/supplier/${id}/records`)
}

export const teamPoolOptionsList = () => {
  return HttpService.get<AxiosRequestConfig, Options[]>('/supplier/supplierPools')
}