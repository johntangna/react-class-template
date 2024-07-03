import {
  Component,
  ComponentElement,
  DOMElement,
  FunctionComponentElement,
  PureComponent,
  ReactComponentElement,
  ReactElement,
  ReactNode,
  ReactPortal,
  RefObject,
} from 'react'
import HocComponent from '../pages/HocComponent'
import { Button, Divider, Drawer, Modal, Space } from 'antd'
import { h } from '..'

type ChildProps = {
  readonly callFunction: () => void
}

type Props = {
  children: FunctionComponentElement<ChildProps>
  title: string
  extra?: boolean
  width: string,
}

type State = {
  isOpen: boolean
}

export default class DrawerCom extends PureComponent<Props> {
  state: State

  constructor(props: any) {
    super(props)
    this.state = {
      isOpen: false,
    }
  }

  showModel() {
    this.setState({
      isOpen: true,
    })
  }

  handleOk() {
    // this.setState({
    //   isModalOpen: false,
    // })
    //@ts-ignore
    this.props.children?.ref?.current?.callFunction()
  }

  handleCancel() {
    this.setState({
      isOpen: false,
    })
    try {
      //@ts-ignore
      this.props.children?.ref?.current?.queryCallFunction()
    } catch (error) {
      console.warn(error)
    }
  }

  render(): ReactNode {
    return (
      <Drawer
        title={this.props.title}
        placement="right"
        onClose={() => this.handleCancel()}
        open={this.state.isOpen}
        destroyOnClose
        width={this.props.width}
        extra={
          this.props.extra ? (
            <Space>
              <Button onClick={() => this.handleCancel()}>取消</Button>
              <Button type="primary" onClick={() => this.handleOk()}>
                提交
              </Button>
            </Space>
          ) : (
            ''
          )
        }
      >
        {this.props.children}
      </Drawer>
    )
  }
}
