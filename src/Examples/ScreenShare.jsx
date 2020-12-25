import React, { useRef } from 'react'
import { Button, message } from 'antd'

const ScreenSharing = () => {
  const myVideo = useRef()
  const startScreenShare = async (e) => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      })
      console.log('success')
      handleSuccess(stream)
    } catch (e) {
      handleError(e)
    }
  }

  const handleSuccess = (stream) => {
    const video = myVideo.current
    window.stream = stream
    video.srcObject = stream
  }

  const handleError = (error) => {
    message.error('getUserMedia错误:', error)
  }

  return (
    <div className="container">
      <h1>
        <span>共享屏幕示例</span>
      </h1>
      <video className="video" ref={myVideo} autoPlay playsInline></video>
      <Button onClick={startScreenShare}>开始共享</Button>
    </div>
  )
}

export default ScreenSharing
