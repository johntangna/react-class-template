import { notification } from "antd";
import axios, { Axios, AxiosError, AxiosRequestConfig, AxiosResponse, HeadersDefaults, InternalAxiosRequestConfig, Method } from "axios";
const store = require("../store").default

const defaultConfig: AxiosRequestConfig = {
  baseURL: '/api',
  timeout: 100000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
}

class HttpService {

  private static axiosInstance = axios.create(defaultConfig)

  constructor() {
    this.interceptorRequest()
    this.interceptorResponse()
  }

  private interceptorRequest() {
    HttpService.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig<any>) => {
        const $config = config

        /**
         * 如果需要请求头上带上关键信息，还需在config.headers[""]附加上关键信息
         */
        if (store.getState().dingTalk.dingTalk.userId !== "") {
          config.headers.userId = store.getState().dingTalk.dingTalk.userId
        }

        return $config
      },

      (error) => {
        notification.error({
          message: error?.response?.data || "请求出现错误",
        })
        return Promise.reject(error)
      },
    )
  }

  private interceptorResponse() {
    HttpService.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        const res = response.data
        /**
         * 这里如果需要进行错误码判断，还需要进一步的判断
         */
        return res
      },
      (error: AxiosError) => {
        axios.isCancel(error)
        notification.error({
          message: error?.response?.data + '' || "响应出现错误",
        })
        return Promise.reject(error)
      },
    )
  }

  request<T>(
    method: Method,
    url: string,
    param?: AxiosRequestConfig,
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
    }
    return new Promise((resolve, reject) => {
      HttpService.axiosInstance
      .request(config)
      .then((res: any) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      })
    })
  }

  post<T extends AxiosRequestConfig, P>(
    url: string,
    params?: T,
  ): Promise<P> {
    return this.request<P>("post", url, params)
  }

  get<T extends AxiosRequestConfig, P>(
    url: string,
    params?: T,
  ): Promise<P> {
    return this.request<P>("get", url, params)
  }
}

export default new HttpService()