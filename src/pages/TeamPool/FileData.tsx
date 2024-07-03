import React, { Component, ReactNode, createRef } from 'react'
import { h } from '../..'
import {
  TableProps,
  Button,
  notification,
  Table,
  Skeleton,
  Pagination,
  Form,
  Input,
  Select,
} from 'antd'
import "../../static/css/file_data.less"
import {
  accountMapping,
  queryAccountList,
  insertAccount,
} from '../../api/account'
import CardDom from '../../component/Card'
import DrawerCom from '../../component/DrawerCom'
import InfoCom, { DetailsData } from '../../component/InfoCom'
import {
  handleMappingFieldRequiredForAccount,
  handleMappingFieldRequiredForFileData,
} from '../../utils/MappingField'
import { AccountData } from './Account'
import HocComponent from '../HocComponent'
import {
  fileDataMapping,
  insertFileData,
  queryFileDataList,
  queryRecord,
} from '../../api/fileData'
import ModifyRecord from '../../component/ModifyRecord'
import Details from './fileData/Details'
import { DataType, ParentContext } from '.'
import { FormInstance } from 'antd/lib'

export type FileDataType = {
  id: number
  supplier_id: number
  supplier_name: string
  business_code: string
  manufacturer: string
  goods_name: string
  spec_name: string
  cost: number
}

type Props = {
  id: number
  supply: Pick<DataType, 'id' | 'name'> & Record<"plate", string>
  isShowAction: (reactNode: ReactNode) => ReactNode | string
}

export type QueryParams = {
  businessCode: string
  goodsName: string
  plate: string
  page: number
  size: number
  supplierId: number
}

type State = {
  spinning: boolean
  data: AccountData[]
  accountDetails: {
    detailsFlag: boolean
    id: number
  }
  recordDetails: {
    detailsFlag: boolean
    id: number
  }
  dataType: DetailsData[]
  queryParams: QueryParams
  total: number
}

export default class FileData extends HocComponent<Props> {
  state: State
  drawerComAdd = createRef<DrawerCom>()
  drawerComEdit = createRef<DrawerCom>()
  recordDrawer = createRef<DrawerCom>()
  infoCom = createRef<InfoCom>()
  form = createRef<FormInstance>()

  constructor(props: Props) {
    super(props)
    this.state = {
      spinning: false,
      data: [],
      accountDetails: {
        detailsFlag: false,
        id: 0,
      },
      recordDetails: {
        detailsFlag: false,
        id: 0,
      },
      dataType: [],
      queryParams: {
        businessCode: '',
        goodsName: '',
        plate: props.supply.plate,
        page: 1,
        size: 20,
        supplierId: props.id,
      },
      total: 0,
    }
    this.queryData(this.state.queryParams)
  }

  columns: TableProps<AccountData>['columns'] = [
    // {
    //   title: '供应商名称',
    //   dataIndex: 'supplier_name',
    //   key: 'supplier_name',
    // },
    {
      title: '商家编码',
      dataIndex: 'business_code',
      key: 'business_code',
    },
    {
      title: '厂商编码',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
    },
    {
      title: '商品名称',
      dataIndex: 'goods_name',
      key: 'goods_name',
    },
    {
      title: '规格',
      dataIndex: 'spec_name',
      key: 'spec_name',
    },
    {
      title: '商品价格',
      dataIndex: 'cost',
      key: 'cost',
    },
    {
      title: '操作',
      key: 'action',
      align: "center",
      render: (_, record) => (
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <div>
            <Button
              size="small"
              type="link"
              onClick={() => {
                this.setNewState({
                  accountDetails: {
                    detailsFlag: true,
                    id: record.id,
                  },
                })
                this.drawerComEdit.current?.showModel()
              }}
            >
              查看详情
            </Button>
          </div>
          <div>
            <Button
              size="small"
              type="link"
              onClick={() => {
                this.setNewState({
                  recordDetails: {
                    detailsFlag: true,
                    id: record.id,
                  },
                })
                this.recordDrawer.current?.showModel()
              }}
            >
              修改记录
            </Button>
          </div>
        </div>
      ),
    },
  ]

  addFileData() {
    fileDataMapping().then((res) => {
      this.setNewState({
        dataType: handleMappingFieldRequiredForFileData(res),
      })
    })
    this.drawerComAdd.current?.showModel()
  }

  queryData(params: QueryParams) {
    this.setNewState({
      spinning: true,
    })
    queryFileDataList(params)
      .then((res) => {
        const { content, total } = res
        this.setNewState({
          data: content,
          total: total,
        })
      })
      .finally(() => {
        this.setNewState({
          spinning: false,
        })
      })
  }

  queryCallFunction() {
    this.queryData(this.state.queryParams)
  }

  /**
   * fix: 解决供应商可能传空的问题
   * @param data 
   * @param value 
   */
  addData(data: DetailsData[], value: Pick<DataType, 'id' | 'name'> & Record<"plate", string>) {
    for (const [key, values] of Object.entries(value)) {
      data.push({
        type: key == "id" ? 'NUMBER' : 'STRING',
        key: key == "id" ? 'supplier_id' : key == "name" ? 'supplier_name' : 'spec_plate',
        explain: key == "id" ? '代理商编码' : key == "name" ? 'supplier_name' : '商品档案对应板块',
        value: values,
      })
    }
    insertFileData(data)
      .then((res) => {
        notification.success({
          message: '已新增一个商品档案信息',
        })
      })
      .finally(() => {
        this.queryData(this.state.queryParams)
      })
    console.log(data)
  }

  renderExtra() {
    return (
      <div>
        <Button
          type="link"
          onClick={() => {
            this.infoCom.current?.callFunction()
          }}
        >
          提交详情
        </Button>
      </div>
    )
  }

  onPageSizeChange(page: number, size: number) {
    this.setNewState({
      queryParams: {
        ...this.state.queryParams,
        page: page,
        size: size,
      },
    })
    this.queryData({
      ...this.state.queryParams,
      page: page,
      size: size,
    })
  }

  onFinish(values: QueryParams) {
    this.queryData({
      ...this.state.queryParams,
      ...values,
    })
  }

  renderData() {
    return (
      <div className='file_data_header'>
        <div style={{ width: '80%' }}>
        <Form
          ref={this.form}
          layout="inline"
          initialValues={{ ...this.state.queryParams }}
          onFinish={(values) => this.onFinish(values)}
        >
          <Form.Item
            colon={false}
            label="商家编码"
            labelAlign="left"
            name="businessCode"
          >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item
            colon={false}
            label="货品名称"
            labelAlign="left"
            name="goodsName"
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
        {
          this.props.isShowAction(<Button type="primary" onClick={() => this.addFileData()}>
          新增商品档案
        </Button>)
        }
        <Table
          loading={this.state.spinning}
          columns={this.columns}
          dataSource={this.state.data}
          pagination={false}
        />
        <div className="footer">
          <Pagination
            total={this.state.total}
            size="small"
            showSizeChanger
            showQuickJumper
            current={this.state.queryParams.page}
            pageSize={this.state.queryParams.size}
            pageSizeOptions={[20, 40, 60, 100]}
            showTotal={(total) => `总共 ${total} 条`}
            onChange={(page, size) => this.onPageSizeChange(page, size)}
          />
        </div>
        <DrawerCom
          ref={this.drawerComAdd}
          width="64%"
          children={
            <CardDom
              title="新增商品档案"
              extra={this.renderExtra()}
              children={
                this.state.dataType.length ? (
                  <ParentContext.Consumer>
                    {(value: Pick<DataType, 'id' | 'name'> & Record<"plate", string>) => (
                      <InfoCom
                        ref={this.infoCom}
                        data={this.state.dataType}
                        allowEditFlag={false}
                        loading={false}
                        supply={value}
                        parentMethod={(data: DetailsData[]) =>
                          this.addData(data, value)
                        }
                      ></InfoCom>
                    )}
                  </ParentContext.Consumer>
                ) : (
                  <Skeleton active></Skeleton>
                )
              }
            ></CardDom>
          }
          title=""
        ></DrawerCom>
        <DrawerCom
          width="64%"
          ref={this.drawerComEdit}
          children={<Details isShowAction={(reactNode: ReactNode) => this.props.isShowAction(reactNode)} id={this.state.accountDetails.id}></Details>}
          title=""
        ></DrawerCom>
        <DrawerCom
          width="64%"
          ref={this.recordDrawer}
          children={
            <ModifyRecord
              id={this.state.recordDetails.id}
              recordFunction={queryRecord}
            ></ModifyRecord>
          }
          title=""
        ></DrawerCom>
      </div>
    )
  }

  render() {
    return <CardDom title="" children={this.renderData()}></CardDom>
  }
}
