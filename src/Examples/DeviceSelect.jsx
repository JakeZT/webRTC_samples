import React, { useEffect, useState, useRef } from 'react'
import { Button, Select } from 'antd'

const { Option } = Select

let videoElement

const DeviceSelect = () => {
  const previewVideo = useRef()
  
  const [videoDevices, videoDevicesChange] = useState([]) 
  const [audioDevices, audioDevicesChange] = useState([])
  const [audioOutputDevices, audioOutputDevicesChange] = useState([])
  const [selectedAudioDevice, selectedAudioDeviceChange] = useState('')
  const [selectedAudioOutputDevice, selectedAudioOutputDeviceChange] = useState('')
  const [selectedVideoDevice, selectedVideoDeviceChange] = useState('')

  useEffect(() => {
    videoElement = previewVideo.current
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
  }, [])


  const updateDevices = () => {
    return new Promise((resolve, reject) => {
      let videoDevices = []
      let audioDevices = []
      let audioOutputDevices = []

      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
            // return the lists
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
    })
  }

  const handleAudioDeviceChange = (e) => {
    selectedAudioDeviceChange(e)
    setTimeout(startTest, 100)// delay to start
  }

  const handleVideoDeviceChange = (e) => {
    selectedVideoDeviceChange(e)
    setTimeout(startTest, 100)
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

  const startTest = () => {
    let audioSource = selectedAudioDevice
    let videoSource = selectedVideoDevice

    let constraints = {
      audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
      video: { deviceId: videoSource ? { exact: videoSource } : undefined },
    }
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        window.stream = stream
        videoElement.srcObject = stream
      })
      .catch((e) => {
        console.log(e)
      })
  }

  return (
    <div className="container">
      <h1>
        <span>设备枚举示例</span>
      </h1>
      <Select
        value={selectedAudioDevice}
        style={{ width: 150, marginRight: '10px' }}
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
      <Select
        value={selectedAudioOutputDevice}
        style={{ width: 150, marginRight: '10px' }}
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
      <Select
        value={selectedVideoDevice}
        style={{ width: 150 }}
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
      <video
        className="video"
        ref={previewVideo}
        autoPlay
        playsInline
        style={{ objectFit: 'contain', marginTop: '10px' }}
      ></video>
      <Button onClick={startTest}>测试</Button>
    </div>
  )
}

export default DeviceSelect
