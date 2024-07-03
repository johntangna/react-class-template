import { Component, ReactNode, createRef } from 'react'
import { h } from '../..'
import { FormInstance, Form, Input, DatePicker } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import UploadCom from '../../component/UploadCom'
import SelectCom from '../../component/SelectCom'
import { teamPoolOptionsList } from '../../api/teamPool'
import { Options } from '../../component/InfoCom'
import HocComponent from '../HocComponent'

export type Data = {
  followTime: string
  supplierId: string
  supplierName: string
  remark: string
  files: File[]
  [key: string]: any
}

type Props = {
  parentMethod: Function
  data: Data
}

type State = {
  files: File[]
  optionData: Options[]
  selectValue: Options
}

export default class TraceRecordAction extends HocComponent<Props> {
  form = createRef<FormInstance<Data>>()
  state: State

  constructor(props: Props) {
    super(props)
    this.state = {
      files: [],
      optionData: [],
      selectValue: {
        label: '',
        value: '',
      },
    }
    this.teamPoolOptionsList()
  }

  teamPoolOptionsList() {
    teamPoolOptionsList().then(res => {
      res = res.map((item) => {
        return {
          label: item.value,
          value: item.label,
        }
      })
      this.setNewState({
        optionData: res,
      })
    })
  }

  saveFile(files: File[]) {
    this.setNewState({
      files: files,
    })
  }

  selectChange(option: Options) {
    this.setNewState({
      selectValue: option,
    })
    this.form.current?.setFieldsValue({
      supplierId: option.value,
    })
  }

  onFinish = (values: Data) => {
    values.followTime = dayjs(values.followTime).format( 'YYYY-MM-DD hh:mm:ss').toString()
    values.files = this.state.files
    values.supplierName = this.state.selectValue.label
    values.supplierId = this.state.selectValue.value
    this.props.parentMethod(values)
  }

  callFunction() {
    this.form.current?.submit()
  }

  render(): ReactNode {
    return (
      <div>
        <Form
          ref={this.form}
          initialValues={{ ...this.props.data }}
          onFinish={this.onFinish}
        >
          <Form.Item
            colon={false}
            label="跟进时间"
            labelAlign="right"
            name="followTime"
            rules={[{ required: true, message: '请选择跟进时间' }]}
          >
            <DatePicker
              showTime
              placeholder='请选择跟进时间，精确到时分秒'
              onChange={(value, dateString) => {
                console.log('Selected Time: ', value)
                console.log('Formatted Selected Time: ', dateString)
              }}
            />
          </Form.Item>
          <Form.Item
            colon={false}
            label="供应商名称"
            labelAlign="right"
            name="supplierId"
            rules={[{ required: true, message: '请选择供应商' }]}
          >
            <SelectCom optionsList={this.state.optionData} parentMethod={(options: Options) => this.selectChange(options)}></SelectCom>
          </Form.Item>
          <Form.Item
            colon={false}
            label="跟进内容"
            labelAlign="right"
            name="remark"
            rules={[{ required: true, message: '请输入跟进内容' }]}
            className='textarea'
          >
            <TextArea 
            placeholder="请输入跟进内容，您可输入最长255个文字" 
            allowClear
            rows={3}
            maxLength={255}
             />
          </Form.Item>
          <Form.Item
            colon={false}
            labelAlign="right"
            name="files"
            className='upload'
            htmlFor={undefined}
            label="文件上传"
          >
            <UploadCom parentMethod={(files: File[]) => this.saveFile(files)} maxCount={3}></UploadCom>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
