import React, { Component } from 'react'
import { h } from '..'
import { Options } from './InfoCom'
import { Select } from 'antd'

type Props = {
  optionsList: Options[]
  parentMethod: Function
  defaultValue?: string
}

export default class SelectCom extends Component<Props> {

  onChange(value: string, option: Options | Array<Options>) {
    this.props.parentMethod(option)
  }

  render() {
    return (
      <Select
        showSearch
        allowClear
        defaultValue={this.props.defaultValue ? this.props.defaultValue : null}
        placeholder="请选择"
        optionFilterProp="label"
        onChange={(value: string, option: Options | Array<Options>) => this.onChange(value, option)}
        options={
          this.props.optionsList
        }
      />
    )
  }
}
