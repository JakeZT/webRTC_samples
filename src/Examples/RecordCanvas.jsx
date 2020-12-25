import React, { useState, useEffect, useRef } from 'react'
import { Button, message } from 'antd'
import '../styles/css/record-canvas.scss'

let mediaRecorder

let recordedBlobs

let stream
let canvas
let context

const RecordCanvas = () => {
  const canvasRef = useRef()
  const videoRef = useRef()

  useEffect(() => {
    drawLine()
  }, [])

  const drawLine = () => {
    canvas = canvasRef.current
    context = canvas.getContext('2d')

    context.fillStyle = '#ececec'
    context.fillRect(0, 0, 320, 320)

    context.lineWidth = 1
    context.strokeStyle = '#28d5de'

    canvas.addEventListener('mousedown', startAction)
    canvas.addEventListener('mouseup', endAction)
  }

  const startAction = (event) => {
    context.beginPath()
    context.moveTo(event.offsetX, event.offsetY)
    context.stroke()

    canvas.addEventListener('mousemove', moveAction)
  }

  const moveAction = (event) => {
    context.lineTo(event.offsetX, event.offsetY)
    context.stroke()
  }

  const endAction = (event) => {
    canvas.removeEventListener('mousemove', moveAction)
  }

  const startCaptureCanvas = async (e) => {
    stream = canvas.captureStream(10)
    const video = videoRef.current
    window.stream = stream
    video.srcObject = stream

    startRecord()
  }

  const startRecord = (e) => {
    stream.addEventListener('inactive', (e) => {
      stopRecord(e)
    })

    recordedBlobs = []

    try {
      mediaRecorder = new MediaRecorder(window.stream, {
        mineType: 'video/webm',
      })
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
  }

  const stopRecord = (e) => {
    try {
      mediaRecorder.stop()
    } catch (e) {
      console.log(e)
    }

    const blob = new Blob(recordedBlobs, { type: 'video/webm' })
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.download = 'canvas.webm'
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)
  }
  const handleDataAvailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data)
    }
  }

  return (
    <div className="container">
      <h1>
        <span>示例</span>
      </h1>

      <div className="small-canvas">
        <canvas ref={canvasRef}></canvas>
      </div>
      <video
        className="small-video"
        ref={videoRef}
        playsInline
        autoPlay
      ></video>
      <div>
        <Button className="button" onClick={startCaptureCanvas}>
          开始
        </Button>
        <Button className="button" onClick={stopRecord}>
          停止
        </Button>
      </div>
    </div>
  )
}

export default RecordCanvas
