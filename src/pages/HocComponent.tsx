import { Component } from 'react'

class HocComponent<P = {}, S = {}, SS = any> extends Component<P, S, SS> {

  setNewState(props: Record<any, any>, callback?: Function) {
    this.setState(
      (state) => ({
        ...state,
        ...props,
      }),
      () => {
        callback?.apply(this)
      },
    )
  }
}

export default HocComponent
