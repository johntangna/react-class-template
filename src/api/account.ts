import { AxiosRequestConfig } from "axios"
import HttpService from "../utils/request"
import { DetailsData } from "../component/InfoCom"
import { AccountData } from "../pages/TeamPool/Account"
import { RecordData } from "../component/ModifyRecord"

export const queryAccountList = (id: number) => {
  return HttpService.get<AxiosRequestConfig, AccountData[]>(`/supplier/supplierAccount/${id}`)
}

export const queryAccountDetailsById = (id: number) => {
  return HttpService.get<AxiosRequestConfig, DetailsData[]>(`/supplier/supplierAccount/${id}/detail`)
}

export const updateAccountDetails = (id: number, data: DetailsData[]) => {
  return HttpService.request('patch', `/supplier/supplierAccount/account/${id}`, {
    data: data,
  })
}

export const accountMapping = () => {
  return HttpService.get<AxiosRequestConfig, DetailsData[]>('/supplier/supplierAccount/mapping')
}

export const insertAccount = (data: DetailsData[]) => {
  return HttpService.post<AxiosRequestConfig, DetailsData[]>('/supplier/supplierAccount', {
    data: data,
  })
}

export const queryRecord = (id: number) => {
  return HttpService.get<AxiosRequestConfig, RecordData[]>(`/supplier/supplierAccount/account/${id}`)
}