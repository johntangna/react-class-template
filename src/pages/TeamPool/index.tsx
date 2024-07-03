import React, {
  Component,
  PureComponent,
  ReactNode,
  createContext,
  createRef,
} from 'react'
import {
  Button,
  Dropdown,
  Form,
  Input,
  MenuProps,
  Pagination,
  Select,
  Skeleton,
  Space,
  Table,
  TableProps,
  Tabs,
  TabsProps,
  Tag,
  notification,
} from 'antd'
import { FormInstance } from 'antd/lib'
import '../../static/css/team_pool.less'
import { h } from '../..'
import { connectToRedux } from '../connectToRedux'
import CardDom from '../../component/Card'
import {
  accept,
  insertTeamPoolDetailsDataById,
  modifyRecord,
  pointOrBlack,
  queryTeamPool,
  teamPoolMapping,
  unAccept,
} from '../../api/teamPool'
import HocComponent from '../HocComponent'
import DrawerCom from '../../component/DrawerCom'
import TeamPoolDetails from './TeamPoolDetails'
import TabTitle from './TabTitle'
import { DownOutlined, LeftOutlined } from '@ant-design/icons'
import InfoCom, { DetailsData, Options } from '../../component/InfoCom'
import { handleMappingFieldRequired } from '../../utils/MappingField'
import { ItemType } from 'antd/es/menu/interface'
import ModifyRecord, { RecordData } from '../../component/ModifyRecord'
import plain$ from 'dingtalk-jsapi/api/ui/input/plain'
import { RouterProps, withRouter } from '../WithRoute'

export type QueryParams = {
  name: string
  brand: string
  plate: string
  followup: string
  page: number
  size: number
  [key: string]: string | number | boolean // 或者其他可能的类型
}

export type DataType = {
  id: number // id
  name: string //名称
  nature: string //公司性质
  address: string //公司地址
  established: string // 公司成立时间
  cooperation_time: string // 合作时间
  cooperation: string //跟进状态： // 未跟进  NOT_FOLLOWED_UP,    // 已跟进  FOLLOWED_UP,   // 已确立  ESTABLISHED,
  plate: string[]
  brand: string[] // 品牌
  followupName: string // 跟进人
  contract: false // 是否签订合同
  supplierStatus: 'SUPPLIER_POINT' | 'SUPPLIER_BLACK' | 'SUPPLIER_PUBLIC'
}

type State = {
  queryParams: QueryParams
  total: number
  spinning: boolean
  data: DataType[]
  details: {
    detailsFlag: boolean
    id: number
  }
  recordDetails: {
    recordsFlag: boolean
    id: number
  }
  dataType: DetailsData[]
  parentData: Pick<DataType, 'id' | 'name'> & Record<'plate', string>
}

const randomColor = ['#ff5500', '#2db7f5', '#87d068', '#108ee9']

export const ParentContext = createContext<
  Pick<DataType, 'id' | 'name'> & Record<'plate', string>
>({ id: 0, name: '', plate: '' })

type Props = RouterProps & Application.ReduxProps

const defaultData = (props: Props) => {
  return {
    queryParams: {
      name: '',
      brand: '',
      plate: props.belongPlate[0],
      followup: '',
      supplierStatus:
        props.router.params.type == 'public'
          ? 'SUPPLIER_PUBLIC'
          : props.router.params.type == 'point'
          ? 'SUPPLIER_POINT'
          : 'SUPPLIER_BLACK',
      followStatus: '',
      page: 1,
      size: 20,
    },
    total: 0,
    spinning: false,
    data: [],
    details: {
      detailsFlag: false,
      id: 0,
    },
    recordDetails: {
      recordsFlag: false,
      id: 0,
    },
    dataType: [],
    parentData: {
      id: 0,
      name: '',
      plate: '',
    },
  }
}

class TeamPool extends HocComponent<Props> {
  state: State
  form = createRef<FormInstance>()
  drawerCom = createRef<DrawerCom>()
  infoCom = createRef<InfoCom>()

  constructor(props: Props) {
    super(props)
    this.state = {
      ...defaultData(props),
    }
    this.queryData(this.state.queryParams)
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.router.params.type !== prevProps.router.params.type) {
      this.setNewState(
        {
          queryParams: {
            ...this.state.queryParams,
            supplierStatus:
              this.props.router.params.type == 'public'
                ? 'SUPPLIER_PUBLIC'
                : this.props.router.params.type == 'point'
                ? 'SUPPLIER_POINT'
                : 'SUPPLIER_BLACK',
          },
        },
        () => {
          // 回归原始状态
          this.setNewState({
            ...defaultData(this.props),
          })
          this.queryData(this.state.queryParams)
        },
      )
    }
  }

  onChange = (key: string) => {
    this.setNewState(
      {
        queryParams: {
          ...this.state.queryParams,
          plate: key,
        },
      },
      () => {
        this.queryData(this.state.queryParams)
      },
    )
  }

  onFinish(values: QueryParams) {
    this.queryData({
      ...this.state.queryParams,
      ...values,
    })
  }

  renderHeader(queryParams: QueryParams) {
    return (
      <div style={{ width: '80%' }}>
        <Form
          ref={this.form}
          layout="inline"
          initialValues={{ ...queryParams }}
          onFinish={(values) => this.onFinish(values)}
        >
          <Form.Item
            colon={false}
            label="供应商名称"
            labelCol={{ span: 7, offset: 1 }}
            labelAlign="right"
            name="name"
          >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item
            colon={false}
            label="跟进状态"
            labelCol={{ span: 7, offset: 0 }}
            labelAlign="right"
            name="followStatus"
          >
            <Select placeholder="请选择跟进状态" allowClear>
              <Select.Option value="FOLLOWED_NO">未跟进</Select.Option>
              <Select.Option value="FOLLOWED_YES">已跟进</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            colon={false}
            label="合作状态"
            labelCol={{ span: 7, offset: 0 }}
            labelAlign="right"
            name="cooperation"
          >
            <Select placeholder="请选择合作状态" allowClear>
              <Select.Option value="NOT_COOPERATION">未合作</Select.Option>
              <Select.Option value="COOPERATION">已合作</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            colon={false}
            label="品牌名称"
            labelCol={{ span: 7, offset: 1 }}
            labelAlign="right"
            name="brand"
          >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item
            colon={false}
            label="跟进人"
            labelCol={{ span: 7, offset: 1 }}
            labelAlign="right"
            name="followup"
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

  items = (): TabsProps['items'] => {
    return [
      {
        key: '品牌外采',
        label: (
          <TabTitle img="static/changmeng.png" title="品牌外采"></TabTitle>
        ),
        children: this.renderHeader(this.state.queryParams),
      },
      {
        key: '药品',
        label: <TabTitle img="static/药品.png" title="药品"></TabTitle>,
        children: this.renderHeader(this.state.queryParams),
      },
      {
        key: '物料供应商',
        label: <TabTitle img="static/供应链.png" title="物料供应商"></TabTitle>,
        children: this.renderHeader(this.state.queryParams),
      },
    ]
  }

  renderTabMenu() {
    return (
      <Tabs
        activeKey={this.state.queryParams.plate}
        items={this.items()?.filter((cb) =>
          this.props.belongPlate.includes(cb.key),
        )}
        onChange={this.onChange}
      />
    )
  }

  addTeamPool() {
    teamPoolMapping().then((res) => {
      this.setNewState({
        dataType: handleMappingFieldRequired(res),
      })
    })
    this.drawerCom.current?.showModel()
  }

  //@ts-ignorefollowupName
  dropdownMenu = (record: DataType): MenuProps => {
    const finalArr: ItemType[] = []
    const defaultArr = [
      {
        key: '1',
        label: (
          <Button type="link" onClick={() => this.accept(record.id)}>
            认领
          </Button>
        ),
      },
      {
        key: '2',
        label: (
          <Button type="link" onClick={() => this.unAccept(record.id)}>
            取消认领
          </Button>
        ),
      },
      {
        key: '3',
        label: (
          <Button type="link" onClick={() => this.public(record.id)}>
            加入公海池
          </Button>
        ),
      },
      {
        key: '4',
        label: (
          <Button type="link" onClick={() => this.point(record.id)}>
            加入重点关注
          </Button>
        ),
      },
      {
        key: '5',
        label: (
          <Button type="link" onClick={() => this.black(record.id)}>
            移入黑名单
          </Button>
        ),
      },
    ]

    if (this.props.router.params.type != 'black') {
      if (record.followupName && record.followupName != '') {
        finalArr.push(defaultArr[1])
      } else {
        finalArr.push(defaultArr[0])
      }
    }

    if (record.supplierStatus == 'SUPPLIER_PUBLIC') {
      finalArr.push(defaultArr[3])
      finalArr.push(defaultArr[4])
    } else if (record.supplierStatus == 'SUPPLIER_BLACK') {
      finalArr.push(defaultArr[2])
      finalArr.push(defaultArr[3])
    } else {
      finalArr.push(defaultArr[2])
      finalArr.push(defaultArr[4])
    }

    return {
      items: finalArr,
    }
  }

  accept(id: number) {
    accept(id)
      .then((res) => {
        notification.success({
          message: '认领成功',
        })
      })
      .finally(() => {
        this.queryData(this.state.queryParams)
      })
  }

  unAccept(id: number) {
    unAccept(id)
      .then((res) => {
        notification.success({
          message: '已取消认领',
        })
      })
      .finally(() => {
        this.queryData(this.state.queryParams)
      })
  }

  public(id: number) {
    pointOrBlack(id, {
      type: 'SUPPLIER_PUBLIC',
    })
      .then((res) => {
        notification.success({
          message: '已加入公海池',
        })
      })
      .finally(() => {
        this.queryData(this.state.queryParams)
      })
  }

  point(id: number) {
    pointOrBlack(id, {
      type: 'SUPPLIER_POINT',
    })
      .then((res) => {
        notification.success({
          message: '已加入重点关注',
        })
      })
      .finally(() => {
        this.queryData(this.state.queryParams)
      })
  }

  black(id: number) {
    pointOrBlack(id, {
      type: 'SUPPLIER_BLACK',
    })
      .then((res) => {
        notification.success({
          message: '已移入黑名单 ',
        })
      })
      .finally(() => {
        this.queryData(this.state.queryParams)
      })
  }

  viewData(data: DataType) {
    this.setNewState({
      details: {
        detailsFlag: true,
        id: data.id,
      },
      parentData: {
        id: data.id,
        name: data.name,
        plate: this.state.queryParams.plate,
      },
    })
  }

  columns: TableProps<DataType>['columns'] = [
    {
      title: '供应商名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '公司性质',
      dataIndex: 'nature',
      key: 'nature',
    },
    {
      title: '公司地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '公司成立时间',
      dataIndex: 'established',
      key: 'established',
    },
    {
      title: '签订合同',
      dataIndex: 'contract',
      key: 'contract',
      width: 120,
      render: (value: boolean, record, index) => {
        return (
          <div className="contract">
            {value ? (
              <span className="on">已签订</span>
            ) : (
              <span className="on off">未签订</span>
            )}
          </div>
        )
      },
    },
    {
      title: '跟进人',
      dataIndex: 'followupName',
      key: 'followupName',
    },
    {
      title: '合作状态',
      dataIndex: 'cooperation',
      width: 120,
      key: 'cooperation',
      render: (value, record, index) => {
        return (
          <div className="cooperation">
            {value != 'COOPERATION' ? (
              <span className="on off">未合作</span>
            ) : (
              <span className="on">已合作</span>
            )}
          </div>
        )
      },
    },
    {
      title: '合作时间',
      dataIndex: 'cooperation_time',
      key: 'cooperation_time',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      render: (value, record, index) => (
        <div>
          {value.map((item: any, subIndex: number) => (
            <Tag
              key={subIndex}
              color={randomColor[Math.floor(Math.random() * 5)]}
            >
              {item}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
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
              onClick={() => this.viewData(record)}
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
                    recordsFlag: true,
                    id: record.id,
                  },
                })
              }}
            >
              修改记录
            </Button>
          </div>
          <div>{this.renderDropDown(record)}</div>
        </div>
      ),
    },
  ]

  renderDropDown(record: DataType): ReactNode {
    const createDropDown = (): ReactNode => {
      return (
        <Dropdown
          destroyPopupOnHide
          menu={{
            ...this.dropdownMenu(record),
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              更多
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      )
    }

    return createDropDown()
  }

  isShowAction(reactNode: ReactNode) {
    const {
      params: { type },
    } = this.props.router
    return type == 'black' ? '' : reactNode
  }

  renderData() {
    return (
      <div>
        {this.isShowAction(
          <Button type="primary" onClick={() => this.addTeamPool()}>
            新增供应链
          </Button>,
        )}
        <Table
          loading={this.state.spinning}
          columns={this.columns}
          dataSource={this.state.data}
          pagination={false}
        />
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

  queryData(params: QueryParams) {
    this.setNewState({
      spinning: true,
    })
    for (const [key, value] of Object.entries(params)) {
      if (value == '') {
        delete params[key]
      }
    }
    queryTeamPool(params)
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

  addData(data: DetailsData[]) {
    insertTeamPoolDetailsDataById(data)
      .then((res) => {
        notification.success({
          message: '已新增一个供应链',
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

  formatPlate(): Options[] {
    return this.props.belongPlate.map((item) => {
      return {
        label: item,
        value: item,
      }
    })
  }

  render() {
    return (
      <div className="animate__animated animate__fadeIn team_pool">
        {(this.state.details.detailsFlag ||
          this.state.recordDetails.recordsFlag) && (
          <div
            style={{
              cursor: 'pointer',
              fontWeight: 500,
              marginBottom: 10,
            }}
            onClick={() => {
              this.setNewState({
                details: {
                  detailsFlag: false,
                  id: 0,
                },
                recordDetails: {
                  recordsFlag: false,
                  id: 0,
                },
              })
            }}
          >
            <LeftOutlined />
            <span>返回</span>
          </div>
        )}
        {this.state.details.detailsFlag ? (
          <ParentContext.Provider value={this.state.parentData}>
            <TeamPoolDetails
              isShowAction={(reactNode: ReactNode) =>
                this.isShowAction(reactNode)
              }
              plateBelongToUser={this.formatPlate()}
              id={this.state.details.id}
            ></TeamPoolDetails>
          </ParentContext.Provider>
        ) : this.state.recordDetails.recordsFlag ? (
          <ModifyRecord
            id={this.state.recordDetails.id}
            recordFunction={modifyRecord}
          ></ModifyRecord>
        ) : (
          <div className="animate__animated animate__fadeIn team_pool">
            <div className="header">
              <CardDom title="" children={this.renderTabMenu()}></CardDom>
            </div>
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
                    onChange={(page, size) => this.onPageSizeChange(page, size)}
                  />
                }
              ></CardDom>
            </div>
          </div>
        )}
        <DrawerCom
          ref={this.drawerCom}
          width="64%"
          children={
            <CardDom
              title="新增供应链"
              extra={this.renderExtra()}
              children={
                this.state.dataType.length ? (
                  <InfoCom
                    ref={this.infoCom}
                    data={this.state.dataType}
                    allowEditFlag={false}
                    loading={false}
                    plateBelongToUser={this.formatPlate()}
                    parentMethod={(data: DetailsData[]) => this.addData(data)}
                  ></InfoCom>
                ) : (
                  <Skeleton active></Skeleton>
                )
              }
            ></CardDom>
          }
          title=""
        ></DrawerCom>
      </div>
    )
  }
}

export default withRouter(connectToRedux(TeamPool))
