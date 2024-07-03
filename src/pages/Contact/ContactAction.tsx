import { PureComponent, ReactNode, createRef } from 'react'
import { h } from '../..'
import { Form, Input, Button, FormInstance } from 'antd'
import HocComponent from '../HocComponent'
import { Options } from '../../component/InfoCom'
import { teamPoolOptionsList } from '../../api/teamPool'
import SelectCom from '../../component/SelectCom'

export type Data = {
  supplierId: string
  supplierName: string
  wechatCode: string
  contactsName: string
  mobile: string
  remark: string
}

type Props = {
  data: Data
  parentMethod: Function
}

type State = {
  optionData: Options[]
  selectValue: Options
}

export default class ContactAction extends HocComponent<Props> {
  form = createRef<FormInstance<Data>>()

  state: State

  constructor(props: Props) {
    super(props)
    this.state = {
      optionData: [],
      selectValue: {
        label: props.data.supplierName,
        value: props.data.supplierId,
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

  selectChange(option: Options) {
    this.setNewState({
      selectValue: option,
    })
    this.form.current?.setFieldsValue({
      supplierId: option.value,
    })
  }

  onFinish = (values: Data) => {
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
            label="供应商名称"
            labelCol={{ span: 7, offset: 1 }}
            labelAlign="right"
            name="supplierId"
            rules={[{ required: true, message: '请输入供应商名称' }]}
          >
            <SelectCom defaultValue={this.props.data.supplierId} optionsList={this.state.optionData} parentMethod={(options: Options) => this.selectChange(options)}></SelectCom>
          </Form.Item>
          <Form.Item
            colon={false}
            label="微信号"
            labelCol={{ span: 7, offset: 1 }}
            labelAlign="right"
            name="wechatCode"
            rules={[{ required: true, message: '请输入微信号' }]}
          >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item
            colon={false}
            label="联系人名称"
            labelCol={{ span: 7, offset: 1 }}
            labelAlign="right"
            name="contactsName"
            rules={[{ required: true, message: '请输入联系人名称' }]}
          >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item
            colon={false}
            label="电话"
            labelCol={{ span: 7, offset: 1 }}
            labelAlign="right"
            name="mobile"
            rules={[{ required: true, message: '请输入电话' }]}
          >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item
            colon={false}
            label="备注"
            labelCol={{ span: 7, offset: 1 }}
            labelAlign="right"
            name="remark"
            rules={[{ required: true, message: '请输入备注' }]}
          >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Form>
      </div>
    )
  }
}
