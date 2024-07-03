import * as dd from "dingtalk-jsapi"

export function ddAuth(corpId: string) {
  return new Promise((resolve, reject) => {
    try {
      dd.runtime.permission.requestAuthCode({
        corpId: corpId,
        //@ts-ignore
        onSuccess: (result) => {
          resolve(result.code);
        },
        onFail: (error: any) => {
          reject(error);
        },
      })
    } catch (error) {
      reject(error)
    }
  })
}