import React, { Component, ReactNode, createRef } from 'react'
import { h } from '..'
import {
  FormInstance,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Radio,
  Skeleton,
} from 'antd'
import HocComponent from '../pages/HocComponent'
import '../static/css/infoCom.less'
import dayjs from 'dayjs'
import { Spin } from 'antd/lib'
import { DataType } from '../pages/TeamPool'
import { typeIs } from '../utils/commonUtils'
import { brandListOptions } from '../api/brand'

type FormData = {
  [key: string]: string | boolean | number
}

export type DetailsData = {
  type: string
  key: string
  explain?: string
  value: any
  require?: boolean
}

type Props = {
  data: DetailsData[] // 原始数据类型列表
  parentMethod: Function // 父类方法
  allowEditFlag?: boolean // 允许编辑的标记，true为等待编辑，false等待提交数据
  loading?: boolean
  supply?: Pick<DataType, 'id' | 'name'> & Record<"plate", string> // 可选参数，关于供应商的默认回传
  plateBelongToUser?: Options[],
}
export type Options = {
  label: string
  value: string
}

type State = {
  formData: {}
  changeValues: {}
  plateOptions: Options[]
  brandOptions: Options[]
  cooperationOptions: Options[]
}

const defaultOptions = [{ label: '', value: '' }]

export default class InfoCom extends HocComponent<Props> {
  form = createRef<FormInstance<FormData>>()
  state: State

  constructor(props: Props) {
    super(props)
    this.state = {
      formData: {},
      changeValues: {},
      plateOptions: props.plateBelongToUser || defaultOptions,
      brandOptions: [
        {
          label: '欧莱雅',
          value: '欧莱雅',
        },
      ],
      cooperationOptions: [
        {
          label: '已合作',
          value: 'COOPERATION',
        },
        {
          label: '未合作',
          value: 'NOT_COOPERATION',
        },
      ],
    }
    this.queryBrandList()
  }

  queryBrandList() {
    brandListOptions().then(res => {
      res = res.map((item) => {
        return {
          label: item.value,
          value: item.value,
        }
      })
      this.setNewState({
        brandOptions: res,
      })
    })
  }

  componentDidMount(): void {
    /**
     * 将传递过来的原始数据类型列表，转换成@params formData数据类型，供表单展示
     */
    const originalForm = Object.create(null)
    this.props?.data?.map((item, index) => {
      /**
       * fix: 如果某个键值对为supplier_id, supplier_name, spec_plate
       * 就赋值当前originalForm当前对象中
       * 否则，原样的不变，依然保持动态改变
       */
      if (item.key == "supplier_id" || item.key == "supplier_name" || item.key == "spec_plate") {
        switch (item.key) {
          case "supplier_id":
            originalForm[item.key] = this.props.supply?.id
            break;
          case "supplier_name":
            originalForm[item.key] = this.props.supply?.name
            break;
          case "spec_plate":
            originalForm[item.key] = this.props.supply?.plate
            break;
        }
      } else {
        originalForm[item.key] = typeIs(item.value) == "Boolean" ? item.value : item.value ? item.value : ''
      }
    })
    this.setNewState({
      formData: originalForm,
    }, () => {
      this.form.current?.setFieldsValue(originalForm)
    })
  }

  handleChangeValues() {
    if (this.props.supply?.id != 0) {
      this.setNewState({
        changeValues: {
          ...this.state.changeValues,
          supplier_id: this.props.supply?.id,
          supplier_name: this.props.supply?.name,
          spec_plate: this.props.supply?.plate,
        },
      })
    }
  }

  /**
   * 通过 @function callFunction 调用时，此方法会在表单无误后，进行提交回调
   * @param values 提交的数据
   */
  onFinish = (values: FormData) => {
    /**
     * feat: 这里追加处理，将表单的数据在处理回原来格式 @type DetailsData[] 回传给父组件进行提交处理
     */
    console.log(this.form.current?.getFieldsValue())
    this.handleChangeValues()
    const detailsData: DetailsData[] = []
    for (const [key, value] of Object.entries(this.state.changeValues)) {
      this.props?.data?.map((item, index) => {
        /**
         * 遍历原始数据类型列表以及表单数据
         * 将相同键的选项，把@param this.props.formData中的值放回到原始数据类型
         */
        if (key == item.key) {
          detailsData.push({
            type: item.type,
            key: key,
            explain: item.explain,
            value: value,
          })
        }
      })
    }
    this.props.parentMethod(detailsData)
  }

  onValuesChange(changeValues: FormData, values: FormData) {
    this.setNewState({
      changeValues: {
        ...this.state.changeValues,
        ...changeValues,
      },
    }, () => {
      this.form.current?.setFieldsValue(changeValues)
    })
  }

  onFieldsChange(changeField: any, allField: any) {
    console.log(changeField, allField)
  }

  changeSelect(value: any, key: string) {
    console.log(value)
    this.setNewState({
      changeValues: {
        ...this.state.changeValues,
        [key]: value,
      },
    }, () => {
      this.form.current?.setFieldsValue(this.state.changeValues)
    })
  }

  changeDate(date: any, dateString: any, key: string) {
    this.setNewState({
      changeValues: {
        ...this.state.changeValues,
        [key]: dateString,
      },
    }, () => {
      this.form.current?.setFieldsValue(this.state.changeValues)
    })
  }

  /**
   * typeof item.value == 'boolean'
                  ? item.value == true
                    ? '是'
                    : '否'
                  : item.key == "cooperation" ? this.state.cooperationOptions.find(cb => cb.value == item.value)?.label : item.value != '' && item.value != undefined
                  ? item.type == "ARRAY" ? item.value.join("、") : item.value 
                  : '暂未填写'
   * @param item 
   * @returns 改造上述方法
   */
  renderSpecifyValue(item: DetailsData) {
    if (item.key == 'supplier_id') {
      return this.props.supply?.id
    } else if (item.key == 'supplier_name') {
      return this.props.supply?.name
    } else {
      return this.props.supply?.plate
    }
  }

  renderValue(item: DetailsData) {
    if (item.value == '' && item.value == undefined) {
      return '暂未填写'
    } else {
      if (typeof item.value == 'boolean') {
        return item.value == true ? '是' : '否'
      } else if (item.type == "ARRAY") {
        return item.value.join("、")
      } else if (item.key == "cooperation") {
        return this.state.cooperationOptions.find(cb => cb.value == item.value)?.label
      } else {
        return item.value
      }
    }
  }

  renderForm(): ReactNode {
    return this.props.loading ? (
      <Skeleton active />
    ) : (
      <Form
        ref={this.form}
        layout="inline"
        initialValues={{ ...this.state.formData }}
        onFinish={this.onFinish}
        onValuesChange={(values: FormData, allValues: FormData) =>
          this.onValuesChange(values, allValues)
        }
        onFieldsChange={(values: any, allField: any) =>
          this.onFieldsChange(values, allField)
        }
      >
        {this.props?.data?.map((item, index) => (
          <Form.Item
            key={index}
            colon={false}
            initialValue={{ ...this.state.formData }}
            label={item.explain}
            labelCol={{ span: 7, offset: 1 }}
            labelAlign="right"
            name={item.key}
            rules={[
              {
                required: item.require,
                message: `请${item.type == 'STRING' ? `输入` : '选择'}${
                  item.explain
                }`,
              },
            ]}
          >
            {(this.props.supply != undefined && this.props.supply.id != 0 &&
              (item.key == 'supplier_id' || item.key == 'supplier_name' || item.key == 'spec_plate')) &&
              this.renderSpecifyValue(item)}
            {this.props.allowEditFlag ? (
              <span>
                {(item.key != 'supplier_id' &&
                  item.key != 'supplier_name' &&
                  item.key != 'spec_plate') &&
                  this.renderValue(item)}
              </span>
            ) : (
              (item.key != 'supplier_id' &&
              (this.props.supply != undefined && this.props.supply.id != 0 ? item.key != 'supplier_name' : true) &&
              item.key != 'spec_plate') && (
                <span>
                  {item.type == 'STRING' &&
                    (item.key != 'cooperation' ? (
                      <Input
                        placeholder="请输入，没有可填暂无"
                        allowClear
                        defaultValue={item.value}
                      />
                    ) : (
                      <Select
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="请选择"
                        defaultValue={item.value}
                        options={this.state.cooperationOptions}
                        onChange={(value) => this.changeSelect(value, item.key)}
                      />
                    ))}
                  {item.type == 'DATE' && (
                    <DatePicker
                      allowClear
                      format="YYYY-MM-DD"
                      placeholder="请选择时间"
                      onChange={(date: any, dateString: any) =>
                        this.changeDate(date, dateString, item.key)
                      }
                      defaultValue={item.value ? dayjs(item.value) : ''}
                    />
                  )}
                  {(item.type == 'NUMBER' || item.type == 'DECIMAL') && (
                    <InputNumber
                      placeholder="请输入，没有可填暂无"
                      min={1}
                      defaultValue={item.value}
                    />
                  )}
                  {item.type == 'ARRAY' && (
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: '100%' }}
                      placeholder="请选择"
                      defaultValue={item.value}
                      onChange={(value) => this.changeSelect(value, item.key)}
                      options={
                        item.key == 'plate'
                          ? this.state.plateOptions
                          : item.key == 'brand'
                          ? this.state.brandOptions
                          : []
                      }
                    />
                  )}
                  {item.type == 'BOOLEAN' && (
                    <Radio.Group defaultValue={item.value}>
                      <Radio value={true}>是</Radio>
                      <Radio value={false}>否</Radio>
                    </Radio.Group>
                  )}
                </span>
              )
            )}
          </Form.Item>
        ))}
      </Form>
    )
  }

  /**
   * 外部调用
   * ps：用于操作按钮不在本页面时使用，通过此方法进行回调使用
   */
  callFunction() {
    this.form.current?.submit()
  }

  render(): ReactNode {
    return <div className="info_com">{this.renderForm()}</div>
  }
}
