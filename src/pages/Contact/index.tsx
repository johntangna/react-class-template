import React, { Component, LegacyRef, createRef } from 'react'
import { connectToRedux } from '../connectToRedux'
import { h } from '../..'
import CardDom from '../../component/Card'
import {
  Form,
  Radio,
  Input,
  Button,
  FormInstance,
  Table,
  Space,
  TableProps,
  Tag,
  Pagination,
  notification,
} from 'antd'
import '../../static/css/contact.less'
import {
  addContact,
  editContact,
  queryContact,
  voidContact,
} from '../../api/contact'
import Model from '../../component/Model'
import ContactAction, { Data } from './ContactAction'
import HocComponent from '../HocComponent'
import VoidAction from './VoidAction'

export type QueryParams = {
  supplierName: string
  contactsName: string
  wechatCode: string
  mobile: string
  page: number
  size: number
}

type State = {
  spinning: boolean
  queryParams: QueryParams
  data: Data
  tableData: DataType[]
  total: number
  title: string
  id: string
  selected: string[]
}

export interface DataType {
  key: string
  id?: string
  supplierId: string
  supplierName: string
  wechatCode: string
  contactsName: string
  mobile: string
  remark: string
}

const defaultData = {
  supplierId: '',
  supplierName: '',
  wechatCode: '',
  contactsName: '',
  mobile: '',
  remark: '暂无',
}

class Contact extends HocComponent<Application.ReduxProps> {
  that = this
  state: State
  form = React.createRef<FormInstance>()
  model = createRef<Model>()
  contactAction = createRef<ContactAction>()
  voidAction = createRef<VoidAction>()

  constructor(props: any) {
    super(props)
    this.state = {
      spinning: false,
      queryParams: {
        supplierName: '',
        contactsName: '',
        wechatCode: '',
        mobile: '',
        page: 1,
        size: 20,
      },
      tableData: [],
      data: defaultData,
      total: 0,
      title: '',
      id: '',
      selected: [],
    }
    this.queryContact(this.state.queryParams)
  }

  queryContact(params: QueryParams) {
    this.setNewState({
      spinning: true,
    })
    queryContact(params)
      .then((res) => {
        const { content, total } = res
        this.setNewState({
          total: total,
          tableData: content,
        })
      })
      .finally(() => {
        this.setNewState({
          spinning: false,
        })
      })
  }

  onFinish = (values: QueryParams) => {
    this.queryContact(values)
  }

  renderHeader() {
    return (
      <div style={{ width: '80%' }}>
        <Form
          ref={this.form}
          layout="inline"
          initialValues={{ ...this.state.queryParams }}
          onFinish={this.onFinish}
        >
          <Form.Item
            colon={false}
            label="联系人名称"
            labelAlign="right"
            name="contactsName"
          >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item
            colon={false}
            label="供应商名称"
            labelCol={{ span: 7, offset: 1 }}
            labelAlign="right"
            name="supplierName"
          >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item
            colon={false}
            label="微信号"
            labelCol={{ span: 7, offset: 1 }}
            labelAlign="right"
            name="wechatCode"
          >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item
            colon={false}
            label="手机号"
            labelCol={{ span: 7, offset: 1 }}
            labelAlign="right"
            name="mobile"
          >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="" style={{ marginLeft: 20 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button
              onClick={() => {
                this.form.current?.resetFields()
              }}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }

  columns: TableProps<DataType>['columns'] = [
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
    },
    {
      title: '微信号',
      dataIndex: 'wechatCode',
      key: 'wechatCode',
    },
    {
      title: '联系人名称',
      dataIndex: 'contactsName',
      key: 'contactsName',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      key: 'action',
      align: "center",
      render: (_, record) => (
        <div>
          <div>
            <Button
              size="small"
              type="link"
              onClick={() => this.editData(record)}
            >
              修改信息
            </Button>
          </div>
          {/* <div>
            <Button size="small" type="link" onClick={() => this.voidData(record)}>
              信息作废
            </Button>
          </div> */}
        </div>
      ),
    },
  ]

  onChange(page: number, size: number) {
    this.setNewState({
      queryParams: {
        ...this.state.queryParams,
        page: page,
        size: size,
      },
    })
    this.queryContact({
      ...this.state.queryParams,
      page: page,
      size: size,
    })
  }

  addContact() {
    this.setNewState({
      title: '新增联系人',
      id: '',
      data: defaultData,
    })
    this.model.current?.showModel()
  }

  editData(data: DataType) {
    this.setNewState({
      title: '编辑联系人',
      id: data.id,
      data: data,
    })
    this.model.current?.showModel()
  }

  voidData(data: DataType) {
    this.setNewState({
      title: '作废信息',
      id: data.id,
    })
    this.model.current?.showModel()
  }

  invalid = () => {
    voidContact({
      ids: [this.state.id],
    }).then((res) => {
      notification.success({
        message: '已作废联系人清单',
      })
    })
  }

  successCallback() {
    this.model.current?.handleCancel()
    this.queryContact(this.state.queryParams)
  }

  sendAddContact = (data: Data) => {
    if (this.state.id) {
      editContact(this.state.id, data)
        .then((res) => {
          notification.success({
            message: '编辑联系人成功',
          })
          this.successCallback()
        })
        .finally(() => {})
    } else {
      addContact(data)
        .then((res) => {
          notification.success({
            message: '新增联系人成功',
          })
          this.successCallback()
        })
        .finally(() => {})
    }
  }

  onSelectChange = (keys: React.Key[]) => {
    this.setNewState({
      selected: keys,
    })
  }

  renderData() {
    return (
      <div>
        <Button type="primary" onClick={() => this.addContact()}>
          添加联系人
        </Button>
        <Table
          loading={this.state.spinning}
          columns={this.columns}
          dataSource={this.state.tableData}
          pagination={false}
        />
      </div>
    )
  }

  render() {
    return (
      <div className="animate__animated animate__fadeIn">
        <CardDom children={this.renderHeader()} title="联系人"></CardDom>

        <div className="body">
          <CardDom title="" children={this.renderData()}></CardDom>
        </div>

        <div className="footer">
          <CardDom
            title=""
            children={
              <Pagination
                total={this.state.total}
                size="small"
                showSizeChanger
                showQuickJumper
                current={this.state.queryParams.page}
                pageSize={this.state.queryParams.size}
                pageSizeOptions={[20, 40, 60, 100]}
                showTotal={(total) => `总共 ${total} 条`}
                onChange={(page, size) => this.onChange(page, size)}
              />
            }
          ></CardDom>
        </div>
        <Model
          ref={this.model}
          title={this.state.title}
          children={
            this.state.title.indexOf('作废') != -1 ? (
              <VoidAction
                ref={this.voidAction}
                invalid={this.invalid}
              ></VoidAction>
            ) : (
              <ContactAction
                ref={this.contactAction}
                data={this.state.data}
                parentMethod={this.sendAddContact}
              />
            )
          }
        ></Model>
      </div>
    )
  }
}
export default connectToRedux(Contact)
