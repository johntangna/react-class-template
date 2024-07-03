import React, { Component, PureComponent } from 'react'
import { h } from '../..'
import HocComponent from '../HocComponent'
import Application from '../../Application'
import { connectToRedux } from '../connectToRedux'
import { getCoprId, getUserByCode } from '../../api/dingApi'
import { ddAuth } from '../../utils/ddAuth'
import { Spin } from 'antd'
import RouterHook from '../../utils/RouterHook'

class Login extends HocComponent<Application.ReduxProps> {
  constructor(props: Application.ReduxProps) {
    super(props)
    this.getDingCoprId().then(res => {
      RouterHook.goToUrl("")
    })
  }

  async getDingCoprId() {
    const corp = await getCoprId()
    const code = await ddAuth(corp.corpId)
    const dingTalk = await getUserByCode({
      code: code as string,
    })
    await this.props.setDingUser(dingTalk)
  }

  render() {
    return (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '10%',
          transform: 'translate(-50%, 0)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src="static/provider.png" style={{ marginBottom: 20 }} />
          <p>请稍候，正在努力加载中。。。</p>
          <Spin />
        </div>
      </div>
    )
  }
}

export default connectToRedux(Login)
