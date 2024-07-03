import React, { Component } from 'react'
import { connectToRedux } from '../connectToRedux'
import { h } from '../..'

class Demo extends Component {
  render() {
    return <div></div>
  }
}
export default connectToRedux(Demo)
