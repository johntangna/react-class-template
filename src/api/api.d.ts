export interface Reponse {
  content: Record<any, any>[]
  total: number
}

export interface DingApiResponse {
	agentId: number,
	corpId: string,
	timeStamp: number,
	nonceStr: string,
	signature: string
}

export interface DingUserResponse {
  userId: string
  dingName: string
  belongPlate: string[]
}

export interface PlateBelongToUser {
  brandCount: number
  SupplierStatus: string
}