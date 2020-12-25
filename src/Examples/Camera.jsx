import React, { useRef} from 'react'
import { Button, message } from 'antd'

const constraints = (window.constraints = {
  video: true,
  audio: false,
})

function Camera() {
  const vRef = useRef()

  const openCamera = async (e) => {
    //
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('success')
      handleSuccess(stream)
    } catch (e) {
      handleError(e)
    }
  }

  const handleSuccess=(stream)=>{
    const video = vRef.current
    const videoTracks = stream.getVideoTracks()
    console.log('使用的设备是:' + videoTracks[0].label)
    window.stream = stream
    video.srcObject = stream
  }

  const handleError=(error) =>{
    if (error.name === 'ConstraintNotSatisfiedError') {
      const v = constraints.video
      message.error(`宽:${v.width.exact} 高:${v.height.exact} 设备不支持`)
    } else if (error.name === 'PermissionDeniedError') {
      message.error('没有摄像头和麦克风的使用权限,请点击允许按钮')
    }
    message.error('getUserMedia错误:', error)
  }

  return (
    <div className="container">
      <h1>
        <span>摄像头示例</span>
      </h1>
      <video className="video" ref={vRef} autoPlay playsInline></video>
      <Button onClick={openCamera}>打开摄像头</Button>
    </div>
  )
}

export default React.memo(Camera)
