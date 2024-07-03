import { Component, ReactNode } from "react"
import { h } from "../.."

type Props = {
  invalid: Function
}

export default class VoidAction extends Component<Props> {

  callFunction() {
    this.props.invalid()
  }

  render(): ReactNode {
      return (
        <div>
          确定作废该联系人信息嘛？
        </div>
      )
  }
}