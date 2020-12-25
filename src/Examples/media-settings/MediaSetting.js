import React, { useRef, useEffect, useState } from 'react'
import { Button, Select, Modal } from 'antd'
import SoundMeter from './soundmeter'
import '../../styles/css/media-settings.scss'
const { Option } = Select

let videoElement
const MediaSettings = (props) => {
  const previewVideoRef = useRef()
  const progressBar = useRef()
  const timer = useRef()
  const timer2 = useRef()


  const [visible, visibleChange] = useState(false)
  const [videoDevices, videoDevicesChange] = useState([])
  const [audioDevices, audioDevicesChange] = useState([])
  const [audioOutputDevices, audioOutputDevicesChange] = useState([])
  const [selectedAudioOutputDevice, selectedAudioOutputDeviceChange] = useState('')
  const [resolution, resolutionChange] = useState('vga')
  const [selectedAudioDevice, selectedAudioDeviceChange] = useState("")
  const [selectedVideoDevice, selectedVideoDeviceChange] = useState('')
  const [audioLevel, audioLevelChange] = useState(0)

  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    window.audioContext = new AudioContext()
  } catch (e) {
    console.log('网页音频API不支持.')
  }

  useEffect(() => {
    if (!!window.localStorage) {
      let deviceInfo = localStorage['deviceInfo']
      if (deviceInfo) {
        let info = JSON.parse(deviceInfo)

        selectedAudioDeviceChange(info.audioDevice)
        selectedVideoDeviceChange(info.videoDevice)
        resolutionChange(info.resolution)
      }
    }

    updateDevices().then((data) => {
      if (selectedAudioDevice === '' && data.audioDevices.length > 0) {
        selectedAudioDeviceChange(data.audioDevices[0].deviceId)
      }
      if (
        selectedAudioOutputDevice === '' &&
        data.audioOutputDevices.length > 0
      ) {
        selectedAudioOutputDeviceChange(data.audioOutputDevices[0].deviceId)
      }
      if (selectedVideoDevice === '' && data.videoDevices.length > 0) {
        selectedVideoDeviceChange(data.videoDevices[0].deviceId)
      }

      videoDevicesChange(data.videoDevices)
      audioDevicesChange(data.audioDevices)
      audioOutputDevicesChange(data.audioOutputDevices)
    })

    return () => {
        clearTimeout(timer)
        clearTimeout(timer2)
      }

  }, [])

  const updateDevices = () => {
    return new Promise((resolve, reject) => {
      let videoDevices = []
      let audioDevices = []
      let audioOutputDevices = []

      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          for (let device of devices) {
            if (device.kind === 'videoinput') {
              videoDevices.push(device)
            } else if (device.kind === 'audioinput') {
              audioDevices.push(device)
            }
            if (device.kind === 'audiooutput') {
              audioOutputDevices.push(device)
            }
          }
        })
        .then(() => {
          let data = { videoDevices, audioDevices, audioOutputDevices }
          resolve(data)
        })
        .catch((error)=>{
            reject(error)
        })
    })
  }

  const soundMeterProcess = () => {
    let val = window.soundMeter.instant.toFixed(2) * 348 + 1
    audioLevelChange(val)
    if (visible) {
      timer.current=setTimeout(soundMeterProcess, 100)
    }
  }

  const stopPreview = () => {
    if (!!window.stream) {
      closeMediaStream(window.stream)
    }
  }
  const handleAudioOutputDeviceChange = (e) => {
    selectedAudioOutputDeviceChange(e)

    if (typeof videoElement.skinId !== 'undefined') {
      videoElement
        .setSinkId(e)
        .then(() => {
          console.log('音频输出设备设置成功')
        })
        .catch((error) => {
          // need to use https
          console.log('音频输出设备设置失败')
        })
    } else {
      console.warn('你的浏览器不支持输出设备选择')
    }
  }
  const startPreview = () => {
    //
    if (!!window.stream) {
      closeMediaStream(window.stream)
    }

    let soundMeter = window.soundMeter = new SoundMeter(window.audioContext)

    videoElement = previewVideoRef.current
    let audioSource = selectedAudioDevice
    let videoSource = selectedVideoDevice

    let constraints = {
      audio: { deviceId:audioSource? { exact: audioSource }:{exact: audioDevices[0].deviceId} },
      video: { deviceId: videoSource ? { exact: videoSource } : {exact: videoDevices[0].deviceId} },
    }
    console.log(audioDevices[0].deviceId)//default
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        window.stream = stream
        videoElement.srcObject = stream
        soundMeter.connectToSource(stream)
        timer2.current=setTimeout(soundMeterProcess, 100)

        return navigator.mediaDevices.enumerateDevices()
      })
      .then((devices) => {})
      .catch((e) => {
        console.log(e)
      })
  }

  const closeMediaStream = (stream) => {
    if (!stream) {
      return
    }

    let tracks, i, len
    if (stream.getTracks) {
      tracks = stream.getTracks()
      for (i = 0, len = tracks.length; i < len; ++i) {
        tracks[i].stop()
      }
    } else {
      tracks = stream.getAudioTracks()
      for (i = 0, len = tracks.length; i < len; ++i) {
        tracks[i].stop()
      }

      tracks = stream.getVideoTracks()
      for (i = 0, len = tracks.length; i < len; ++i) {
        tracks[i].stop()
      }
    }
  }
// {"audioDevice":"default","videoDevice":"c3b876b39d8abc9e04d38ae203b9936b040db64ae62169d5919293b41c02dc03","resolution":"fullhd"}
  const showModal = () => {
    visibleChange(true)
    setTimeout(startPreview, 100)
  }

  const handleOk = (e) => {
    visibleChange(false)
    // if (!!window.localStorage) {
      let deviceInfo = {
        audioDevice: selectedAudioDevice,
        videoDevice: selectedVideoDevice,
        resolution: resolution,
      }
      localStorage['deviceInfo'] = JSON.stringify(deviceInfo)
    // }
    stopPreview()
  }

  const handleCancel = () => {
    visibleChange(false)
    stopPreview()
  }

  const handleAudioDeviceChange = (e) => {
    selectedAudioDeviceChange(e)
    setTimeout(startPreview, 100)
  }

  const handleVideoDeviceChange = (e) => {
    selectedVideoDeviceChange(e)
    setTimeout(startPreview, 100)
  }

  const handleResolutionChange = (e) => {
    resolutionChange(e)
  }

  return (
    <div className="container">
      <h1>
        <span>设置综合示例</span>
      </h1>
      <Button onClick={showModal}>修改设备</Button>
      <Modal
        title="修改设备"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="OK"
        cancelText="Cancel"
      >
        <div className="item">
          <span className="item-left">麦克风</span>
          <div className="item-right">
            <Select
              value={selectedAudioDevice}
              style={{ width: 350 }}
              onChange={handleAudioDeviceChange}
            >
              {audioDevices.map((device, index) => {
                return (
                  <Option value={device.deviceId} key={device.deviceId}>
                    {device.label}
                  </Option>
                )
              })}
            </Select>
            <div
              ref={progressBar}
              style={{
                width: audioLevel + 'px',
                height: '10px',
                backgroundColor: '#8dc63f',
                marginTop: '20px',
              }}
            ></div>
          </div>
        </div>
        <div className="item">
          <span className="item-left">摄像头</span>
          <div className="item-right">
            <Select
              value={selectedVideoDevice}
              style={{ width: 350 }}
              onChange={handleVideoDeviceChange}
            >
              {videoDevices.map((device, index) => {
                return (
                  <Option value={device.deviceId} key={device.deviceId}>
                    {device.label}
                  </Option>
                )
              })}
            </Select>
            <div className="video-container">
              <video
                id="previewVideo"
                ref={previewVideoRef}
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              ></video>
            </div>
          </div>
        </div>
        <div className="item">
          <span className="item-left">音频设备</span>
          <div className="item-right">
            <Select
              value={selectedAudioOutputDevice}
              style={{ width: 350 }}
              onChange={handleAudioOutputDeviceChange}
            >
              {audioOutputDevices.map((device, index) => {
                return (
                  <Option value={device.deviceId} key={device.deviceId}>
                    {device.label}
                  </Option>
                )
              })}
            </Select>
          </div>
        </div>
        <div className="item">
          <span className="item-left">清晰度</span>
          <div className="item-right">
            <Select
              style={{ width: 350 }}
              value={resolution}
              onChange={handleResolutionChange}
            >
              <Option value="qvga">流畅(320x240)</Option>
              <Option value="vga">标清(640x360)</Option>
              <Option value="hd">高清(1280x720)</Option>
              <Option value="fullhd">超清(1920x1080)</Option>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default MediaSettings
