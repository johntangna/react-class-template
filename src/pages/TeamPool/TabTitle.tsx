import React, { Component } from 'react'
import { h } from '../..'

type Props = {
  img: string
  title: string
}

export default class TabTitle extends Component<Props> {
  renderTabTitle({ img, title }: Props) {
    return (
      <div className="flex_center">
        <img width={18} height={18} src={img} />
        <span style={{ marginLeft: 5 }}>{title}</span>
      </div>
    )
  }

  render() {
    return <div>{this.renderTabTitle(this.props)}</div>
  }
}
