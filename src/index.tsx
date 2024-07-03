import React from 'react'
import { createRoot } from 'react-dom/client'
import Application from './Application'
import dayjs from 'dayjs'
dayjs.locale('zh-cn')
import 'dayjs/locale/zh-cn'
import "animate.css"

export function h(type: any, props: any, ...children: any[]) {
  return React.createElement(type, props, ...children)
}

createRoot(Application.container).render(Application.root())