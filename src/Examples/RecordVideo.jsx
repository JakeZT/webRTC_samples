import React, { useState, useEffect, useRef } from 'react'
import { Button, message } from 'antd'
import '../styles/css/record-video.scss'

let mediaRecorder
let recordedBlobs
let videoPreview
let videoPlayer

const RecordVideo = (props) => {
  const [status, statusChange] = useState('start')
  const videoPreviewRef = useRef()
  const videoPlayerRef = useRef()

  useEffect(() => {
    videoPreview = videoPreviewRef.current
    videoPlayer = videoPlayerRef.current
  }, [])

  const startClickHandler = async (e) => {
    let constraints = {
      audio: true,
      video: {
        width: 1280,
        height: 720,
      },
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      window.stream = stream
      videoPreview.srcObject = stream

      statusChange('startRecord')
    } catch (e) {
      console.log('navigator.mediaDevices.getUserMedia:', e)
    }
  }

  const startRecordButtonClickHandler = (e) => {
    recordedBlobs = []

    let options = { mineType: 'video/webm;codecs=vp9' }

    if (!MediaRecorder.isTypeSupported(options.mineType)) {
      console.log('video/webm;codecs=vp9不支持')
      options = { mineType: 'video/webm;codecs=vp8' }
      if (!MediaRecorder.isTypeSupported(options.mineType)) {
        console.log('video/webm;codecs=vp8不支持')
        options = { mineType: 'video/webm' }
        if (!MediaRecorder.isTypeSupported(options.mineType)) {
          console.log('video/webm不支持')
          options = { mineType: '' }
        }
      }
    }

    try {
      mediaRecorder = new MediaRecorder(window.stream, options)
    } catch (e) {
      console.log('MediaRecorder:', e)
      return
    }

    mediaRecorder.onstop = (event) => {
      console.log('Recorder stopped:', event)
      console.log('Recorder blobs:', recordedBlobs)
    }

    mediaRecorder.ondataavailable = handleDataAvailable

    mediaRecorder.start(10)

    statusChange('stopRecord')
  }

  const handleDataAvailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data)
    }
  }
  

  const stopRecordButtonClickHandler = (e) => {
    mediaRecorder.stop()
    statusChange('play')
  }

  const playButtonClickHandler = (e) => {
    const blob = new Blob(recordedBlobs, { type: 'video/webm' })

    videoPlayer.src = null
    videoPlayer.src = window.URL.createObjectURL(blob)
    videoPlayer.controls = true
    videoPlayer.play()
    statusChange('download')
  }

  const downloadButtonClickHandler = (e) => {
    const blob = new Blob(recordedBlobs, { type: 'video/webm' })
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.download = 'videoRecord.webm'
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)
    statusChange('start')
  }



  return (
    <div className="container">
      <h1>
        <span>示例</span>
      </h1>

      <video
        className="small-video"
        ref={videoPreviewRef}
        playsInline
        autoPlay
        muted
      ></video>
      <video
        className="small-video"
        ref={videoPlayerRef}
        playsInline
        loop
      ></video>

      <div>
        <Button
          className="button"
          onClick={startClickHandler}
          disabled={status != 'start'}
        >
          打开摄像头
        </Button>
        <Button
          className="button"
          onClick={startRecordButtonClickHandler}
          disabled={status != 'startRecord'}
        >
          开始录制
        </Button>
        <Button
          className="button"
          onClick={stopRecordButtonClickHandler}
          disabled={status != 'stopRecord'}
        >
          停止录制
        </Button>
        <Button
          className="button"
          onClick={playButtonClickHandler}
          disabled={status != 'play'}
        >
          播放
        </Button>
        <Button
          className="button"
          onClick={downloadButtonClickHandler}
          disabled={status != 'download'}
        >
          下载
        </Button>
      </div>
    </div>
  )
}

export default RecordVideo
