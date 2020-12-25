import React, { useEffect, useState, useRef } from 'react'
import { Button, message } from 'antd'
import '../styles/css/record-audio.scss'

let mediaRecorder
let recordedBlobs
let audioPlayer

const RecordAudio = (props) => {
  const audioPlayerRef = useRef()
  const [status, statusChange] = useState('start')

  useEffect(() => {
    audioPlayer = audioPlayerRef.current
  }, [])

  const startClickHandler = async (e) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      window.stream = stream

      statusChange('startRecord')
    } catch (e) {
      console.log('navigator.mediaDevices.getUserMedia:', e)
    }
  }

  const startRecordButtonClickHandler = (e) => {
    recordedBlobs = []

    let options = { mineType: 'audio/ogg;' }

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

    mediaRecorder.ondataavailable = handleDataAvailable //不断push进音频流

    mediaRecorder.start(10)

    statusChange('stopRecord')
  }

  const stopRecordButtonClickHandler = (e) => {
    mediaRecorder.stop()
    statusChange('play')
  }

  const playButtonClickHandler = (e) => {
    const blob = new Blob(recordedBlobs, { type: 'audio/ogg' })

    audioPlayer.src = null
    audioPlayer.src = window.URL.createObjectURL(blob)
    audioPlayer.play()
    statusChange('download')
  }

  const downloadButtonClickHandler = (e) => {
    //   新建一个a标签，然后点击后删除掉
    const blob = new Blob(recordedBlobs, { type: 'audio/ogg' })
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.download = 'test.ogg'
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)
    statusChange('start')
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
      <audio ref={audioPlayerRef} autoPlay controls></audio>
      <div>
        <Button
          className="button"
          onClick={startClickHandler}
          disabled={status != 'start'}
        >
          打开麦克风
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

export default RecordAudio
