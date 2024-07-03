import React, { Component, ReactNode, createRef } from 'react'
import { h } from '../..'
import {
  Button,
  Dropdown,
  Skeleton,
  Space,
  Table,
  TableProps,
  notification,
} from 'antd'
import HocComponent from '../HocComponent'
import { DownOutlined } from '@ant-design/icons'
import CardDom from '../../component/Card'
import DrawerCom from '../../component/DrawerCom'
import InfoCom, { DetailsData } from '../../component/InfoCom'
import {
  accountMapping,
  insertAccount,
  queryAccountList,
  queryRecord,
} from '../../api/account'
import { handleMappingFieldRequiredForAccount } from '../../utils/MappingField'
import { DataType, ParentContext } from '.'
import Details from './account/Details'
import { modifyRecord } from '../../api/teamPool'
import ModifyRecord from '../../component/ModifyRecord'

export type AccountData = {
  id: number
  supplier_id: number
  accounts_bank_card: number
  accounts_bank_addr: string
  accounts_name: string
}

type Props = {
  id: number
  isShowAction: (reactNode: ReactNode) => ReactNode | string
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
}

export default class Account extends HocComponent<Props> {
  state: State
  drawerComAdd = createRef<DrawerCom>()
  drawerComEdit = createRef<DrawerCom>()
  recordDrawer = createRef<DrawerCom>()
  infoCom = createRef<InfoCom>()

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
    }
    this.queryData()
  }

  columns: TableProps<AccountData>['columns'] = [
    // {
    //   title: '供应商编号',
    //   dataIndex: 'supplier_id',
    //   key: 'supplier_id',
    // },
    {
      title: '收款人全称',
      dataIndex: 'accounts_name',
      key: 'accounts_name',
    },
    {
      title: '开户行地址',
      dataIndex: 'accounts_bank_addr',
      key: 'accounts_bank_addr',
    },
    {
      title: '银行账户卡号',
      dataIndex: 'accounts_bank_card',
      key: 'accounts_bank_card',
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

  addAccount() {
    accountMapping().then((res) => {
      this.setNewState({
        dataType: handleMappingFieldRequiredForAccount(res),
      })
    })
    this.drawerComAdd.current?.showModel()
  }

  queryData() {
    this.setNewState({
      spinning: true,
    })
    queryAccountList(this.props.id)
      .then((res) => {
        this.setNewState({
          data: res,
        })
      })
      .finally(() => {
        this.setNewState({
          spinning: false,
        })
      })
  }

  queryCallFunction() {
    this.queryData()
  }

  addData(
    data: DetailsData[],
    value: Pick<DataType, 'id' | 'name'> & Record<'plate', string>,
  ) {
    data.push({
      type: 'NUMBER',
      key: 'supplier_id',
      explain: '关联供用商id',
      value: value.id,
    })
    insertAccount(data)
      .then((res) => {
        notification.success({
          message: '已新增一个银行账户信息',
        })
      })
      .finally(() => {
        this.queryData()
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

  renderData() {
    return (
      <div>
        {
          this.props.isShowAction(<Button type="primary" onClick={() => this.addAccount()}>
          新增银行账户
        </Button>)
        }
        <Table
          loading={this.state.spinning}
          columns={this.columns}
          dataSource={this.state.data}
          pagination={false}
        />
        <DrawerCom
          ref={this.drawerComAdd}
          width="64%"
          children={
            <CardDom
              title="新增银行账户"
              extra={this.renderExtra()}
              children={
                this.state.dataType.length ? (
                  <ParentContext.Consumer>
                    {(
                      value: Pick<DataType, 'id' | 'name'> &
                        Record<'plate', string>,
                    ) => (
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
