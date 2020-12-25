import React, { useRef, useEffect, useState } from 'react'
// import {Button,message} from "antd";
import SoundMeter from './soundmeter'

let soundMeter
const AudioVolume = () => {
  const [audioLevel, setAudioLevel] = useState(0)
  const timer = useRef()
  const timer2 = useRef()
  useEffect(() => {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext
      window.audioContext = new AudioContext()
    } catch (e) {
      console.log('网页音频API不支持.')
    }

    soundMeter = window.soundMeter = new SoundMeter(window.audioContext)

    const constraints = (window.constraints = {
      audio: true,
      video: false,
    })

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(handleSuccess)
      .catch(handleError)
    return () => {
      clearTimeout(timer)
      clearTimeout(timer2)
    }
  }, [])

  const handleSuccess = (stream) => {
    window.stream = stream
    soundMeter.connectToSource(stream)
    timer.current = setTimeout(soundMeterProcess, 100)
  }

  const soundMeterProcess = () => {
    let val = window.soundMeter.instant.toFixed(2) * 348 + 1
    setAudioLevel(val)
    timer2.current = setTimeout(soundMeterProcess, 100)
  }

  const handleError = (error) => {
    console.log('getUserMedia error:', error.message, error.name)
  }

  return (
    <div className="container">
      <h1>
        <span>音量检测示例</span>
      </h1>
      <div
        style={{
          width: audioLevel + 'px',
          height: '10px',
          backgroundColor: '#8dc63f',
          marginTop: '20px',
        }}
      ></div>
    </div>
  )
}

export default AudioVolume
