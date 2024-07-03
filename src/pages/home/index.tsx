import React, { Component, PureComponent } from 'react'
import {
  BarController,
  LineController,
  LineElement,
  DoughnutController,
  ArcElement,
  LinearScale,
  BarElement,
  TimeScale,
  Tooltip,
  BubbleDataPoint,
  Point,
  CategoryScale,
  Legend,
  PointElement,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { enUS } from 'date-fns/locale'
import { ReactChart } from 'chartjs-react'
import '../../static/css/home.less'
import { h } from '../..'
import HocComponent from '../HocComponent'
import { connectToRedux } from '../connectToRedux'
import { plateBelongToUser } from '../../api/home'
import { Row, Col } from 'antd'
import CardDom from '../../component/Card'
import { PlateOptionsType } from '../../store/dictionarySlice'

// Register modules,
// this example for time scale and linear scale
ReactChart.register(
  BarController,
  LinearScale,
  BarElement,
  TimeScale,
  Tooltip,
  Legend,
  CategoryScale,
  DoughnutController,
  ArcElement,
  LineElement,
  LineController,
  PointElement,
)

type State = {
  pie: PlateOptionsType[]
}

type Props = Application.ReduxProps

class Home extends HocComponent<Props> {
  state: State

  constructor(props: Props) {
    super(props)
    this.state = {
      pie: [],
    }
    this.getPie(props)
  }

  componentDidMount(): void {}

  getPie(props: Props) {
    plateBelongToUser(this.props.userId).then((res) => {
      res = res.map((item) => {
        return {
          brandCount: item.brandCount,
          SupplierStatus: item.SupplierStatus,
          supplierStatusName: props.plateOptions.find(
            (cb) => cb.SupplierStatus == item.SupplierStatus,
          ).supplierStatusName,
        }
      })
      this.setNewState({
        pie: res,
      })
    })
  }

  // renderBar() {
  //   const ctx = document.getElementById('bar') as HTMLCanvasElement

  //   new Chart(ctx, {
  //     type: 'bar',
  //     data: {
  //       labels: this.state.pie.map((item) => item.supplierStatusName),
  //       datasets: this.state.pie.map((item) => {
  //         return {
  //           label: item.supplierStatusName,
  //           data: item.brandCount,
  //           borderWidth: 1,
  //         }
  //       }),
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //         },
  //       },
  //     },
  //   })
  // }

  render() {
    return (
      <div style={{ overflow: 'hidden' }}>
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <CardDom
              title=""
              children={
                  <ReactChart
                    type="doughnut"
                    updateMode='resize'
                    data={{
                      labels: this.state.pie.map(
                        (item) => item.supplierStatusName,
                      ),
                      datasets: [
                        {
                          backgroundColor: [
                            'rgba(112, 82, 255, 1)',
                            'rgba(112, 82, 255, 0.8)',
                            'rgba(112, 82, 255, 0.5)',
                          ],
                          borderWidth: 1,
                          data: this.state.pie.map(
                            (item) => item.brandCount,
                          ) as (
                            | number
                            | [number, number]
                            | Point
                            | BubbleDataPoint
                            | null
                          )[],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: true,
                        },
                      },
                      scales: {
                      },
                    }}
                  />
              }
            ></CardDom>
          </Col>
          <Col className="gutter-row" span={10}>
            <CardDom
              title=""
              children={
                <div>
                  <span className="bar">
                    提示: 供应链公海包含重点供应链和公海池中供应链
                  </span>
                  <ReactChart
                    type="bar"
                    updateMode='resize'
                    data={{
                      labels: this.state.pie.map(
                        (item) => item.supplierStatusName,
                      ),
                      datasets: [
                        {
                          backgroundColor: [
                            'rgba(112, 82, 255, 1)',
                            'rgba(112, 82, 255, 0.8)',
                            'rgba(112, 82, 255, 0.5)',
                          ],
                          borderWidth: 1,
                          data: this.state.pie.map(
                            (item) => item.brandCount,
                          ) as (
                            | number
                            | [number, number]
                            | Point
                            | BubbleDataPoint
                            | null
                          )[],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                          },
                        },
                      },
                    }}
                    height={120}
                  />
                </div>
              }
            ></CardDom>
          </Col>
          <Col className="gutter-row" span={8}>
          <CardDom
              title=""
              children={
                <div>
                  <span className="bar">
                    提示: 供应链公海包含重点供应链和公海池中供应链
                  </span>
                  <ReactChart
                    type="line"
                    updateMode='resize'
                    data={{
                      labels: this.state.pie.map(
                        (item) => item.supplierStatusName,
                      ),
                      datasets: [
                        {
                          backgroundColor: [
                            'rgba(112, 82, 255, 1)',
                            'rgba(112, 82, 255, 0.8)',
                            'rgba(112, 82, 255, 0.5)',
                          ],
                          borderWidth: 1,
                          data: this.state.pie.map(
                            (item) => item.brandCount,
                          ) as (
                            | number
                            | [number, number]
                            | Point
                            | BubbleDataPoint
                            | null
                          )[],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                          },
                        },
                      },
                    }}
                    height={160}
                  />
                </div>
              }
            ></CardDom>
          </Col>
        </Row>
      </div>
    )
  }
}

export default connectToRedux(Home)
