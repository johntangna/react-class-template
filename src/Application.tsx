import { ConfigProvider, Spin } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import {
  HashRouter,
  Route,
  RouteObject,
  RouterProvider,
  Routes,
} from 'react-router-dom'
import { router } from './routes'
import { h } from '.'
import { Component, ReactElement, ReactNode, StrictMode, Suspense } from 'react'
import { Provider } from 'react-redux'
import store from './store'
import Home from './pages/home'

class Application {
  static container: HTMLElement = document.querySelector('#app') as HTMLElement

  static AuthRoute({ children }: any): ReactNode {
    return children
  }

  static recursionRoute(
    route: Application.AppRoute,
    index: number,
  ): ReactElement {
    return route?.index ? (
      <Route key={index} index element={<Home />} />
    ) : (
      <Route
        key={index}
        path={route.path}
        element={
          <Suspense
            fallback={
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '10%',
                  transform: 'translate(-50%, 0)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <img src="static/provider.png" style={{ marginBottom: 20 }} />
                  <p>请稍候，正在努力加载中。。。</p>
                  <Spin />
                </div>
              </div>
            }
          >
            <route.element />
          </Suspense>
        }
      >
        {route?.children?.length &&
          route.children.map((item, index1) =>
            this.recursionRoute(item, index1),
          )}
      </Route>
    )
  }

  static root(): ReactNode {
    return (
      <Provider store={store}>
        <ConfigProvider
          locale={zhCN}
          theme={{
            token: {
              colorPrimary: '#7052ff',
              colorPrimaryActive: '#8671EC',
              colorPrimaryBorder: '#8671EC',
              colorPrimaryHover: '#8671EC',
              colorLink: '#7052ff',
            },
            components: {
              Button: {},
              Form: {
                labelColor: '#767e8c',
                inlineItemMarginBottom: 15,
              },
              Card: {},
              Table: {
                headerColor: '#767e8c',
                headerBg: '#ffffff',
              },
            },
          }}
        >
          <HashRouter basename="/">
            <Routes>
              {router.map((item: Application.AppRoute, index: number) =>
                Application.recursionRoute(item, index),
              )}
            </Routes>
          </HashRouter>
        </ConfigProvider>
      </Provider>
    )
  }
}

export { Application }
export default Application
