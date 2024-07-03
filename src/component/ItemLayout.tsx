import React, { Component, ReactNode } from 'react'
import { h } from '..'
import '../static/css/item_layout.less'

type Props = {
  itemNode: ReactNode
  detailsNode: ReactNode
  itemTitle: string
  detailsTitle: string
}

export default class ItemLayout extends Component<Props> {
  render() {
    return (
      <div
        className="item_layout"
        style={{
          display: 'flex',
          height: 500,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: 200,
            padding: 20,
            border: '0.5px solid #f2f2f2',
            borderRadius: 10,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="title">{this.props.itemTitle}</div>
          <div style={{ overflow: 'overlay', height: "calc(100% - 63px)" }}>
            {this.props.itemNode}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: 20,
            border: '0.5px solid #f2f2f2',
            borderRadius: 10,
            marginLeft: 10,
          }}
        >
          <span className="title">{this.props.detailsTitle}</span>
          <div style={{ marginTop: 25, overflow: 'overlay', height: '100%' }}>
            {this.props.detailsNode}
          </div>
        </div>
      </div>
    )
  }
}
