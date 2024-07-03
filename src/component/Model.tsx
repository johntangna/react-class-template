import { Component, ComponentElement, DOMElement, FunctionComponentElement, PureComponent, ReactComponentElement, ReactElement, ReactNode, ReactPortal, RefObject } from 'react'
import HocComponent from '../pages/HocComponent'
import { Divider, Modal } from 'antd'
import { h } from '..'

type ChildProps = {
  readonly callFunction: () => void;
}

type Props = {
  children: FunctionComponentElement<ChildProps>
  title: string
}

type State = {
  isModalOpen: boolean
}

export default class Model extends PureComponent<Props> {
  state: State
  
  constructor(props: any) {
    super(props)
    this.state = {
      isModalOpen: false,
    }
  }

  showModel() {
    this.setState({
      isModalOpen: true,
    })
  }

  handleOk() {
    // this.setState({
    //   isModalOpen: false,
    // })
    //@ts-ignore
    this.props.children?.ref?.current.callFunction()
  }

  handleCancel() {
    this.setState({
      isModalOpen: false,
    })
    //@ts-ignore
    this.props.children?.ref?.current?.form?.current.resetFields()
  }

  render(): ReactNode {
    return (
      <Modal
        title={this.props.title}
        open={this.state.isModalOpen}
        onOk={() => this.handleOk()}
        onCancel={() => this.handleCancel()}
        destroyOnClose={true}
        maskClosable={false}
      >
        <Divider></Divider>
        {this.props.children}
      </Modal>
    )
  }
}
