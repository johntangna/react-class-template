import React, { Component, ReactNode, createRef } from 'react'
import { h } from '../..'
import CardDom from '../../component/Card'
import HocComponent from '../HocComponent'
import { Button, Skeleton, Spin, Tabs, TabsProps, notification } from 'antd'
import TabTitle from './TabTitle'
import FileData from './FileData'
import Account from './Account'
import InfoCom, { DetailsData, Options } from '../../component/InfoCom'
import {
  queryTeamPoolDetailsById,
  updateTeamPoolDetailsDataById,
} from '../../api/teamPool'
import { handleMappingFieldRequired } from '../../utils/MappingField'
import { DataType, ParentContext } from '.'

type Props = {
  id: number
  plateBelongToUser: Options[]
  isShowAction: (reactNode: ReactNode) => ReactNode | string
}

type State = {
  dataType: DetailsData[]
  allowEditFlag: boolean
  formSubmitLoading: boolean
}

export default class TeamPoolDetails extends HocComponent<Props> {
  state: State
  infoCom = createRef<InfoCom>()
  fileData = createRef<FileData>()
  account = createRef<Account>()

  constructor(props: Props) {
    super(props)
    this.state = {
      dataType: [],
      allowEditFlag: true,
      formSubmitLoading: false,
    }
    this.queryData()
  }

  queryData() {
    queryTeamPoolDetailsById(this.props.id).then((res) => {
      const detailsData = handleMappingFieldRequired(res)
      this.setNewState({
        dataType: detailsData,
        formSubmitLoading: false,
      })
    })
  }

  tabChange(key: string) {
    key == '商品档案'
      ? this.fileData.current?.queryCallFunction()
      : this.account.current?.queryData()
  }

  items = (): TabsProps['items'] => {
    return [
      {
        key: '商品档案',
        label: <TabTitle img="static/file.png" title="商品档案"></TabTitle>,
        children: <ParentContext.Consumer>
          {
            (value: Pick<DataType, 'id' | 'name'> &
              Record<'plate', string>) => <FileData isShowAction={(reactNode: ReactNode) => this.props.isShowAction(reactNode)} ref={this.fileData} id={this.props.id} supply={value}></FileData>
          }
        </ParentContext.Consumer>,
      },
      {
        key: '银行账户',
        label: <TabTitle img="static/account.png" title="银行账户"></TabTitle>,
        children: <Account isShowAction={(reactNode: ReactNode) => this.props.isShowAction(reactNode)} ref={this.account} id={this.props.id}></Account>,
      },
    ]
  }

  /**
   * 提交时保存
   * @param data
   */
  editData(data: DetailsData[]) {
    console.log(data)
    data.map((item) => {
      delete item.explain
    })
    this.setNewState({
      allowEditFlag: true,
      formSubmitLoading: true,
    })
    updateTeamPoolDetailsDataById(this.props.id, data)
      .then((res) => {
        notification.success({
          message: '已更新合作详情',
        })
      })
      .finally(() => {
        this.queryData()
      })
  }

  /**
   * 编辑动作，允许可编辑
   */
  allowEdit(flag: boolean) {
    this.setNewState({
      allowEditFlag: flag,
    })
  }

  renderExtra() {
    return (
      <div>
        {this.state.allowEditFlag ? (
          this.props.isShowAction(<Button type="link" onClick={() => this.allowEdit(false)}>
          编辑
        </Button>)
        ) : (
          <div>
            <span>
              <Button type="link" onClick={() => this.allowEdit(true)}>
                取消编辑
              </Button>
            </span>
            <span>
              <Button
                type="link"
                onClick={() => {
                  this.infoCom.current?.callFunction()
                }}
              >
                提交详情
              </Button>
            </span>
          </div>
        )}
      </div>
    )
  }

  render() {
    return (
      <div className="animate__animated animate__fadeIn team_pool">
        <div className="header">
          <CardDom
            title="合作详情"
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
                      allowEditFlag={this.state.allowEditFlag}
                      loading={this.state.formSubmitLoading}
                      supply={value}
                      plateBelongToUser={this.props.plateBelongToUser}
                      parentMethod={(data: DetailsData[]) =>
                        this.editData(data)
                      }
                    ></InfoCom>
                  )}
                </ParentContext.Consumer>
              ) : (
                <Skeleton active />
              )
            }
          ></CardDom>
        </div>

        <div className="body">
          <CardDom
            title=""
            children={
              <Tabs
                defaultActiveKey="商品档案"
                items={this.items()}
                onChange={(key: string) => this.tabChange(key)}
              />
            }
          ></CardDom>
        </div>
      </div>
    )
  }
}
