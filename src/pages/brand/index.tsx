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
import ContactAction, { Data } from './BrandAction'
import HocComponent from '../HocComponent'
import { addBrand, editBrand, queryBrand } from '../../api/brand'
import BrandAction from './BrandAction'

export type QueryParams = {
  brandName: string
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
  id: number
  brandName: string
  createTime: string
  operatorName: string
}

const defaultData = {
  brandName: '',
}

class Brand extends HocComponent<Application.ReduxProps> {
  that = this
  state: State
  form = React.createRef<FormInstance>()
  model = createRef<Model>()
  brandAction = createRef<BrandAction>()

  constructor(props: any) {
    super(props)
    this.state = {
      spinning: false,
      queryParams: {
        brandName: '',
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
    this.queryBrand(this.state.queryParams)
  }

  queryBrand(params: QueryParams) {
    this.setNewState({
      spinning: true,
    })
    queryBrand(params)
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
    this.queryBrand(values)
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
            label="品牌名称"
            labelAlign="right"
            name="brandName"
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
      title: '品牌名称',
      dataIndex: 'brandName',
      key: 'brandName',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
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
    this.queryBrand({
      ...this.state.queryParams,
      page: page,
      size: size,
    })
  }

  addBrand() {
    this.setNewState({
      title: '新增品牌',
      id: '',
      data: defaultData,
    })
    this.model.current?.showModel()
  }

  editData(data: DataType) {
    this.setNewState({
      title: '编辑品牌',
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
    this.queryBrand(this.state.queryParams)
  }

  sendAddBrand = (data: Data) => {
    if (this.state.id) {
      editBrand(this.state.id, data)
        .then((res) => {
          notification.success({
            message: '编辑品牌成功',
          })
          this.successCallback()
        })
        .finally(() => {})
    } else {
      addBrand(data)
        .then((res) => {
          notification.success({
            message: '新增品牌成功',
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
        <Button type="primary" onClick={() => this.addBrand()}>
          添加品牌
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
        <CardDom children={this.renderHeader()} title=""></CardDom>

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
            <ContactAction
              ref={this.brandAction}
              data={this.state.data}
              parentMethod={this.sendAddBrand}
            />
          }
        ></Model>
      </div>
    )
  }
}
export default connectToRedux(Brand)
