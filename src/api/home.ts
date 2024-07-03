import { AxiosRequestConfig } from "axios"
import HttpService from "../utils/request"
import { PlateOptionsType } from "../store/dictionarySlice"

export const plateBelongToUser = (userId: string) => {
  return HttpService.get<AxiosRequestConfig, PlateOptionsType[]>('/supplierIndex/', {
    params: {
      userId: userId,
    },
  })
}