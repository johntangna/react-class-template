import { Component, PureComponent, ReactNode } from 'react'
import { h } from '..'
import { Outlet, useLocation } from 'react-router'
import { connect, useSelector } from 'react-redux'
import { connectToRedux } from './connectToRedux'
import { Link } from 'react-router-dom'
import {} from 'react-router'
import '../static/css/layout.less'
import HocComponent from './HocComponent'
import RouterHook from '../utils/RouterHook'
import { getCoprId, getUserByCode } from '../api/dingApi'
import { ddAuth } from '../utils/ddAuth'
import { Avatar } from 'antd'

type State = {
  activeIndex: number
}

class Layout extends HocComponent<Application.ReduxProps> {
  menuList: Application.MenuType[] = [
    {
      url: 'home',
      name: '首页',
    },
    {
      url: 'teamPool/point',
      name: '重点供应链',
    },
    {
      url: 'teamPool/public',
      name: '供应链公海',
    },
    {
      url: 'traceRecord',
      name: '跟进记录',
    },
    {
      url: 'contact',
      name: '联系人',
    },
    {
      url: 'teamPool/black',
      name: '黑名单',
    },
    {
      url: 'brand',
      name: '品牌册',
    },
  ]

  state: State

  constructor(props: any) {
    super(props)
    this.state = {
      activeIndex: 0,
    }
    this.render()
  }

  componentDidMount(): void {
    const location = RouterHook.getCurrentRouter()
    console.log(location)
    this.setNewState({
      activeIndex: this.menuList.findIndex((cb) =>
        location.hash.includes(cb.url),
      ),
    })
    // alert(1)
    // alert(JSON.stringify(this.props))
  }

  renderHeader() {
    return (
      <div
        style={{
          padding: '15px 10px 15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span
          className="iconfont icon-gongyingshangguanlis"
          style={{
            color: '#7052ff',
            fontSize: '26px',
          }}
        >
          <span
            style={{
              fontSize: '20px',
              color: '#323232',
              fontWeight: 600,
              marginLeft: 10,
            }}
          >
            小欧供应链
          </span>
        </span>
        <div>
          <div
            className='avatar'
          >
            <Avatar src={<img src="/static/头像.png" alt="avatar" />} />
          </div>
          <span style={{ textAlign: 'right' }}>{this.props?.dingName}</span>
        </div>
      </div>
    )
  }

  render(): ReactNode {
    return (
      <div className="flex flex-col" style={{ width: '100%', height: '100%' }}>
        {this.renderHeader()}
        <div className="flex flex1">
          <div className="menu">
            {this.menuList.map((item: Application.MenuType, index: number) => (
              <div
                onClick={() => {
                  this.setNewState({ activeIndex: index })
                }}
                key={index}
                className="menu_item"
              >
                <Link
                  className={this.state.activeIndex == index ? 'active' : ''}
                  to={item.url}
                >
                  <span>{item.name}</span>
                </Link>
              </div>
            ))}
          </div>
          <div className="content flex1">
            <div className="right">
              <Outlet></Outlet>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connectToRedux(Layout)
