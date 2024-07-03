import React, {
  Component,
  EventHandler,
  MouseEventHandler,
  createRef,
} from 'react'
import { h } from '..'
import { UploadOutlined } from '@ant-design/icons'
import { Upload, UploadFile, Button, notification } from 'antd'
import { UploadRef } from 'antd/lib/upload/Upload'

type Props = {
  parentMethod: Function
  maxCount: number
}

type State = {
  fileList: Array<UploadFile>
}

export default class UploadCom extends Component<Props> {
  state: State
  uploadRef = createRef<UploadRef>()

  constructor(props: Props) {
    super(props)
    this.state = {
      fileList: [],
    }
  }

  onRemove(file: UploadFile<File>) {
    const index = this.state.fileList.indexOf(file as never)
    const newFileList = this.state.fileList.slice()
    newFileList.splice(index, 1)
    this.setState((state: State) => {
      this.props.parentMethod(newFileList)
      return {
        fileList: newFileList,
      }
    })
  }

  beforeUpload(file: UploadFile<File>) {
    if (this.state.fileList.length === 3) {
      notification.warning({
        message: "最大上传文件数为3个",
      })
      return
    }
    this.setState((state: State) => {
      this.props.parentMethod([...state.fileList, file])
      return {
        fileList: [...state.fileList, file],
      }
    })
    return false
  }

  // uploadEvent($event: MouseEvent) {
  //   $event.bubbles = true
  // }

  render() {
    return (
      <div>
        <Upload
          ref={this.uploadRef}
          listType="picture-card"
          maxCount={this.props.maxCount}
          multiple
          onRemove={(file) => this.onRemove(file)}
          beforeUpload={(file) => this.beforeUpload(file)}
          fileList={this.state.fileList}
        >
          <Button
            icon={<UploadOutlined />}
            style={{ position: 'absolute', zIndex: 1 }}
          ></Button>
        </Upload>
      </div>
    )
  }
}
