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
  Divider,
  Empty,
  Select,
  DatePicker,
  Spin,
  Skeleton,
} from 'antd'
import Model from '../../component/Model'
import HocComponent from '../HocComponent'
import DrawerCom from '../../component/DrawerCom'
import VoidAction from './VoidAction'
import TraceRecordAction, { Data } from './TraceRecordAction'
import {
  createTraceRecoid,
  queryTraceRecord,
  voidTraceRecoid,
} from '../../api/traceRecord'
import ContactDetails from '../../component/ModifyRecord'
import ItemLayout from '../../component/ItemLayout'
import { downloadFile } from '../../utils/fileDownload'
import '../../static/css/modify_record.less'
import { dateFormat } from '../../utils/commonUtils'

export type QueryParams = {
  followPersonName: string
  supplierName: string
  startTime: Date | string
  endTime: Date | string
  status: number
  page: number
  size: number
  [key: string]: any
}

type State = {
  queryParams: QueryParams
  data: Data
  title: string
  id: string
  selected: string[]
  tableData: DataType[]
  total: number
  currentIndex: number
  loading: boolean
}

export interface DataType {
  id: number
  followTime: string
  supplierName: string
  remark: string
  imageUrl: string[]
  operatorName: string
  createTime: string
  status: number
}

const defaultData = {
  followTime: '',
  supplierId: '',
  supplierName: '',
  remark: '',
  files: [],
}

class TraceRecord extends HocComponent<Application.ReduxProps> {
  state: State
  form = React.createRef<FormInstance>()
  addDrawer = createRef<DrawerCom>()
  traceRecordAction = createRef<TraceRecordAction>()
  voidAction = createRef<VoidAction>()

  constructor(props: any) {
    super(props)
    this.state = {
      queryParams: {
        followPersonName: '',
        supplierName: '',
        startTime: '',
        endTime: '',
        status: 0,
        page: 1,
        size: 20,
      },
      data: defaultData,
      title: '',
      id: '',
      selected: [],
      tableData: [],
      total: 0,
      currentIndex: 0,
      loading: false,
    }
    this.queryTraceRecord(this.state.queryParams)
  }

  queryTraceRecord(params: QueryParams) {
    for (const [key, value] of Object.entries(params)) {
      if (value === '') {
        delete params[key]
      }
    }
    this.setNewState({
      loading: true,
    })
    queryTraceRecord(params).then((res) => {
      const { content, total } = res
      this.setNewState({
        tableData: content,
        total: total,
      })
    }).finally(() => {
      this.setNewState({
        loading: false,
      })
    })
  }

  onFinish = (values: QueryParams) => {
    if (values.startTime) {
      values.startTime = dateFormat('YYYY-mm-dd HH:MM:SS', new Date(values.startTime) as Date)
    }
    if (values.endTime) {
      values.endTime = dateFormat('YYYY-mm-dd HH:MM:SS', new Date(values.endTime) as Date)
    }
    this.queryTraceRecord({
      ...this.state.queryParams,
      ...values,
    })
  }

  renderHeader() {
    return (
      <div style={{ width: '80%' }} className='trace_record_form'>
        <Form
          ref={this.form}
          layout="inline"
          initialValues={{ ...this.state.queryParams }}
          onFinish={this.onFinish}
        >
          <Form.Item
            colon={false}
            label="跟进人名称"
            labelAlign="right"
            name="followPersonName"
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
            label="开始时间"
            labelCol={{ span: 7, offset: 1 }}
            labelAlign="right"
            name="startTime"
          >
            <DatePicker
              allowClear
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择开始时间"
            />
          </Form.Item>
          <Form.Item
            colon={false}
            label="结束时间"
            labelCol={{ span: 7, offset: 1 }}
            labelAlign="right"
            name="endTime"
          >
            <DatePicker
              allowClear
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择结束时间"
            />
          </Form.Item>
          <Form.Item
            colon={false}
            label="跟进状态"
            labelCol={{ span: 7, offset: 1 }}
            labelAlign="right"
            name="status"
          >
            <Select placeholder="请选择跟进状态" allowClear>
              <Select.Option value={0}>跟进中</Select.Option>
              <Select.Option value={1}>已删除</Select.Option>
            </Select>
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

  onChange(page: number, size: number) {
    this.setNewState({
      queryParams: {
        ...this.state.queryParams,
        page: page,
        size: size,
      },
    })
    this.queryTraceRecord({
      ...this.state.queryParams,
      page: page,
      size: size,
    })
  }

  addContact() {
    this.setNewState({
      title: '新增跟进记录',
      id: '',
      data: defaultData,
    })
    this.addDrawer.current?.showModel()
  }

  invalid = () => {
    voidTraceRecoid({
      ids: [this.state.id],
    }).then((res) => {
      notification.success({
        message: '已作废跟进记录',
      })
    })
  }

  addTraceRecord = (data: Data) => {
    const formData = new FormData()
    console.log(data)
    for (const key in data) {
      if (key != 'files') {
        formData.append(key, data[key])
      }
    }
    data.files.map((item) => {
      formData.append('files', item)
    })
    createTraceRecoid(formData).then((res) => {
      notification.success({
        message: '已为您新增一条跟进记录',
      })
      this.addDrawer.current?.handleCancel()
      this.queryTraceRecord(this.state.queryParams)
    })
  }

  renderItemNode() {
    return this.state.loading ? <Skeleton active avatar></Skeleton> : this.state.tableData.length ? (
      this.state.tableData.map((item, index) => (
        <div
          key={index}
          className={
            index == this.state.currentIndex
              ? 'moditfy_record_item moditfy_record_item_active flex'
              : 'moditfy_record_item flex'
          }
          onClick={() => {
            this.setNewState({
              currentIndex: index,
            })
          }}
        >
          <div>
            <img width={30} height={25} src="/static/头像.png" />
          </div>
          <div>
            <div style={{ fontSize: 13, marginLeft: 10 }}>
              {item.operatorName}
            </div>
            <span style={{ fontSize: 12, marginLeft: 10 }}>
              {item.status == 1 ? (
                <span style={{ color: 'red' }}>已删除</span>
              ) : (
                <span style={{ color: 'green' }}>跟进中</span>
              )}
            </span>
          </div>
        </div>
      ))
    ) : (
      <Empty description="暂无跟进记录" />
    )
  }

  renderDetailsNode() {
    return this.state.loading ? <Skeleton active></Skeleton> : this.state.tableData.length ? (
      <div>
        <div className="flex_vertical_center">
          <img width={30} height={30} src="/static/日期.png" />
          <span style={{ fontWeight: 700, fontSize: 14, marginLeft: 10 }}>
            {this.state.tableData[this.state.currentIndex]?.followTime}
          </span>
        </div>
        <div>
          <div style={{ marginLeft: 40, marginTop: 15 }}>
            <div className="key_value">
              <span className="key_name">跟进供应商</span>
              <span>
                {this.state.tableData[this.state.currentIndex]?.supplierName}
              </span>
            </div>
            <div className="key_value">
              <span className="key_name">跟进内容</span>
              <span>
                {this.state.tableData[this.state.currentIndex]?.remark}
              </span>
            </div>
            <div className="key_value" style={{ display: 'flex' }}>
              <span className="key_name">跟进附件</span>
              <span style={{ display: 'flex' }}>
                {this.state.tableData[this.state.currentIndex]?.imageUrl?.map(
                  (item, subIndex) => (
                    <div
                      key={subIndex}
                      style={{ marginRight: 10, cursor: 'pointer' }}
                    >
                      <img
                        src="/static/附件.png"
                        width={30}
                        height={30}
                        onClick={() => window.open(item)}
                      />
                      <span style={{ fontSize: 13 }}>
                        {item.substring(item.lastIndexOf('/') + 1)}
                      </span>
                    </div>
                  ),
                )}
              </span>
            </div>
            <span>
              {this.state.tableData[this.state.currentIndex]?.createTime}
            </span>
            <span style={{ paddingLeft: 10 }}>由</span>
            <span style={{ padding: '0 5px' }}>
              {this.state.tableData[this.state.currentIndex]?.operatorName}
            </span>
            <span>创建</span>
          </div>
        </div>
      </div>
    ) : (
      <Empty description="暂无跟进明细" />
    )
  }

  renderTraceRecord() {
    return (
      <ItemLayout
        itemTitle="跟进记录操作人"
        detailsTitle="跟进明细"
        itemNode={this.renderItemNode()}
        detailsNode={this.renderDetailsNode()}
      ></ItemLayout>
    )
  }

  renderData() {
    return (
      <div>
        <Button type="primary" onClick={() => this.addContact()}>
          新增跟进记录
        </Button>
        {this.renderTraceRecord()}
      </div>
    )
  }

  render() {
    return (
      <div className="animate__animated animate__fadeIn trace_record">
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
        <DrawerCom
          ref={this.addDrawer}
          title="新增跟进记录"
          extra={true}
          width="40%"
          children={
            <TraceRecordAction
              ref={this.traceRecordAction}
              data={this.state.data}
              parentMethod={this.addTraceRecord}
            ></TraceRecordAction>
          }
        ></DrawerCom>
      </div>
    )
  }
}
export default connectToRedux(TraceRecord)
