import { Children, PureComponent, ReactNode } from 'react'
import { h } from '..'
import { Card } from 'antd'

type Props = {
  children: ReactNode
  title: string
  border?: boolean
  extra?: ReactNode
}

export default class CardDom extends PureComponent<Props> {
  render(): ReactNode {
    return (
      <div>
        <Card
          title={this.props.title}
          bordered={this.props.border || false}
          style={{ width: '100%' }}
          styles={{
            title: {
              color: '#30343b',
              fontWeight: '500',
            },
            body: {
              padding: "24px 48px",
            },
          }}
          extra={this.props.extra}
        >
          {this.props.children}
        </Card>
      </div>
    )
  }
}
