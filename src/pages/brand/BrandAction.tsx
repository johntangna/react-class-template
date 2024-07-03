import { PureComponent, ReactNode, createRef } from 'react'
import { h } from '../..'
import { Form, Input, Button, FormInstance } from 'antd'
import HocComponent from '../HocComponent'
import { Options } from '../../component/InfoCom'
import { teamPoolOptionsList } from '../../api/teamPool'
import SelectCom from '../../component/SelectCom'
import { brandListOptions } from '../../api/brand'

export type Data = {
  brandName: string
}

type Props = {
  data: Data
  parentMethod: Function
}


export default class BrandAction extends HocComponent<Props> {
  form = createRef<FormInstance<Data>>()

  onFinish = (values: Data) => {
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
            label="品牌名称"
            labelCol={{ span: 7, offset: 1 }}
            labelAlign="right"
            name="brandName"
            rules={[{ required: true, message: '请输入品牌名称' }]}
          >
            <Input placeholder="请输入" allowClear maxLength={50}/>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
