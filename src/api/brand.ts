import { AxiosRequestConfig } from "axios"
import { QueryParams } from "../pages/brand"
import HttpService from "../utils/request"
import { Reponse } from "./api"
import { Data } from "../pages/brand/BrandAction"
import { Options } from "../component/InfoCom"

export const queryBrand = (params: QueryParams) => {
  return HttpService.get<AxiosRequestConfig, Reponse>('/supplierBrand/', {
    params: params,
  })
}

export const addBrand = (data: Data) => {
  return HttpService.post<AxiosRequestConfig, Data>('/supplierBrand', {
    data: data,
  })
}

export const editBrand = (id: string, data: Data) => {
  return HttpService.request('patch', `/supplierBrand/${id}`, {
    data: data,
  })
}

export const brandListOptions = () => {
  return HttpService.get<AxiosRequestConfig, Options[]>('/supplierBrand/brands')
}