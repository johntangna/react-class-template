
declare namespace Application {
  type AppRoute = {
    index?: boolean
    path: string
    element?: ReactNode
    children?: AppRoute[]
    isAuth?: boolean
  }

  type MenuType = {
    url: string
    name: string
  }

  type ReducerType = {
    dingTalk: Reducer<State>
    dictionary: Reducer<State>
  }

  type ReduxProps = {
    userId: string
    dingName: string
    belongPlate: string[]
    setDingUser: Function
    plateOptions: PlateOptionsType[]
    setPlateoptions: Function
  }
}