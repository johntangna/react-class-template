import React, { Component, PureComponent } from 'react'
import '../static/css/modify_record.less'
import { h } from '..'
import ItemLayout from './ItemLayout'
import { modifyRecord } from '../api/teamPool'
import CardDom from './Card'
import { Divider, Empty } from 'antd'
import { typeIs } from '../utils/commonUtils'

type Props = {
  id: number
  recordFunction: (id: number) => Promise<RecordData[]>
}

type State = {
  data: RecordData[]
  currentIndex: number
}

type RecordDataDetails = {
  type: string
  key: string
  explain: string
  oldValue: string
  newValue: string
}

export type RecordData = {
  userName: number
  time: string
  records: RecordDataDetails[]
}

export default class ModifyRecord extends Component<Props> {
  state: State

  constructor(props: Props) {
    super(props)
    this.state = {
      data: [],
      currentIndex: 0,
    }
    props.recordFunction(this.props.id).then((res) => {
      this.setState({
        data: res,
      })
    })
  }

  renderItemNode() {
    return this.state.data.length ? (
      this.state.data.map((item, index) => (
        <div
          key={index}
          className={
            index == this.state.currentIndex
              ? 'moditfy_record_item moditfy_record_item_active flex'
              : 'moditfy_record_item flex'
          }
          onClick={() => {
            this.setState((state: State) => ({
              ...state,
              currentIndex: index,
            }))
          }}
        >
          <div>
            <img width={30} height={25} src="/static/头像.png" />
          </div>
          <div>
            <div style={{ fontSize: 13, marginLeft: 10 }}>{item.userName}</div>
            <span style={{ fontSize: 12, marginLeft: 10, color: '#8d97a3' }}>
              {item.time}
            </span>
          </div>
        </div>
      ))
    ) : (
      <Empty description="暂无操作修改记录"/>
    )
  }

  formatValue(value: any) {
    switch (typeIs(value)) {
      case "Boolean":
        return value ? '是' : '否'
      case "Array":
        return value.join("、")
      default:
        return value
    }
  }

  renderDetailsNode() {
    return this.state.data.length ? (
      <div>
        <div className="flex_vertical_center">
          <img width={30} height={30} src="/static/日期.png" />
          <span style={{ fontWeight: 700, fontSize: 14, marginLeft: 10 }}>
            {this.state.data[this.state.currentIndex]?.time}
          </span>
        </div>
        <div>
          {this.state.data[this.state.currentIndex]?.records.map(
            (item, index) => (
              <div key={index} style={{ marginLeft: 40, marginTop: 15 }}>
                {/* <div className="key_value">
                  <span className="key_name">键名</span>
                  <span>{item.key}</span>
                </div> */}
                <div className="key_value">
                  <span className="key_name">键名术语</span>
                  <span>{item.explain}</span>
                </div>
                <div className="key_value">
                  <span className="key_name">修改前的旧值</span>
                  <span>{this.formatValue(item.oldValue)}</span>
                </div>
                <div className="key_value">
                  <span className="key_name">修改后的新值</span>
                  <span>{this.formatValue(item.newValue)}</span>
                </div>
                <Divider></Divider>
              </div>
            ),
          )}
        </div>
      </div>
    ) : (
      <Empty description="暂无修改明细"/>
    )
  }

  render() {
    return (
      <div className="animate__animated animate__fadeIn team_pool">
        <CardDom
          title=""
          children={
            <ItemLayout
              itemTitle="操作修改人"
              detailsTitle="修改明细"
              itemNode={this.renderItemNode()}
              detailsNode={this.renderDetailsNode()}
            ></ItemLayout>
          }
        ></CardDom>
      </div>
    )
  }
}
