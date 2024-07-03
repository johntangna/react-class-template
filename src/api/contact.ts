import { AxiosRequestConfig } from "axios";
import { DataType, QueryParams } from "../pages/Contact";
import HttpService from "../utils/request";
import { Data } from "../pages/Contact/ContactAction";
import { Reponse } from "./api";

export const queryContact = (params: QueryParams) => {
  return HttpService.get<AxiosRequestConfig, Reponse>("/supplierContacts", {
    params: params,
  })
}

export const addContact = (data: Data) => {
  return HttpService.post<AxiosRequestConfig, DataType>("/supplierContacts", {
    data: data,
  })
}

export const editContact = (id: string, data: Data) => {
  return HttpService.request('patch', `/supplierContacts/${id}`, {
    data: data,
  })
}

export const voidContact = (data: Record<"ids", number[] | string[]>) => {
  return HttpService.post<AxiosRequestConfig, DataType>(`/supplierContacts/operationStatus`, {
    data: data,
  })
}
