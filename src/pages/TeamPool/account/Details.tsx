import React, { Component, ReactNode, createRef } from 'react'
import { Button, Skeleton, Spin, Tabs, TabsProps, notification } from 'antd'
import InfoCom, { DetailsData } from '../../../component/InfoCom'
import HocComponent from '../../HocComponent'
import { h } from '../../..'
import CardDom from '../../../component/Card'
import { handleMappingFieldRequiredForAccount } from '../../../utils/MappingField'
import {
  queryAccountDetailsById,
  updateAccountDetails,
} from '../../../api/account'
import { DataType, ParentContext } from '..'

type Props = {
  id: number
  isShowAction: (reactNode: ReactNode) => ReactNode | string
}

type State = {
  dataType: DetailsData[]
  allowEditFlag: boolean
  formSubmitLoading: boolean
}

export default class Details extends HocComponent<Props> {
  state: State
  infoCom = createRef<InfoCom>()

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
    queryAccountDetailsById(this.props.id).then((res) => {
      const detailsData = handleMappingFieldRequiredForAccount(res)
      this.setNewState({
        dataType: detailsData,
        formSubmitLoading: false,
      })
    })
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
    updateAccountDetails(this.props.id, data)
      .then((res) => {
        notification.success({
          message: '已更新银行账户信息',
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
            title="银行账户基础信息"
            extra={this.renderExtra()}
            children={
              this.state.dataType.length ? (
                <ParentContext.Consumer>
                  {(value: Pick<DataType, 'id' | 'name'> & Record<"plate", string>) => (
                    <InfoCom
                      ref={this.infoCom}
                      data={this.state.dataType}
                      allowEditFlag={this.state.allowEditFlag}
                      loading={this.state.formSubmitLoading}
                      supply={value}
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
      </div>
    )
  }
}
