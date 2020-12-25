import React, { useRef, useEffect } from 'react'
import { Button } from 'antd'

let localConnection
let remoteConnection
let sendChannel
let receiveChannel

let fileReader
let receiveBuffer = []
let receivedSize = 0
let filetInput
let sendProgress
let receiveProgress

const DataChannelFile = () => {
  const sendProgressRef = useRef()
  const receiveProgressRef = useRef()
  const fileInputRef = useRef()
  const downloadRef = useRef()


  useEffect(() => {
    sendProgress = sendProgressRef.current
    receiveProgress = receiveProgressRef.current

    filetInput = fileInputRef.current
    filetInput.addEventListener('change', async () => {
      const file = filetInput.files[0]
      if (!file) {
        console.log('没有选择文件')
      } else {
        console.log('选择的文件是:' + file.name)
      }
    })
    return () => {
      
    }
  }, [])


  const startSendFile = async () => {
    localConnection = new RTCPeerConnection()
    localConnection.addEventListener('icecandidate', onLocalIceCandidate)

    sendChannel = localConnection.createDataChannel('webrtc-datachannel')
    // 注意这里是arraybuffer
    sendChannel.binaryType = 'arraybuffer'
    sendChannel.onopen = onSendChannelStateChange
    sendChannel.onclose = onSendChannelStateChange

    remoteConnection = new RTCPeerConnection()
    remoteConnection.addEventListener('icecandidate', onRemoteIceCandidate)

    localConnection.addEventListener(
      'iceconnectionstatechange',
      onLocalIceStateChange
    )
    remoteConnection.addEventListener(
      'iceconnectionstatechange',
      onRemoteIceStateChange
    )

    remoteConnection.ondatachannel = receiveChannelCallback

    try {
      const offer = await localConnection.createOffer()
      await onCreateOfferSuccess(offer)
    } catch (e) {
      onCreateSessionDescriptionError(e)
    }
  }

  const onSendChannelStateChange = () => {
    // 判断通道是否建立
    const readyState = sendChannel.readyState
    console.log('发送通道状态:' + readyState)

    if (readyState === 'open') {
      sendData()
    }
  }

  const onReceiveChannelStateChange = () => {
    const readyState = receiveChannel.readyState
    console.log('接收通道状态:' + readyState)
  }

  const receiveChannelCallback = (event) => {
    receiveChannel = event.channel
    // 接受类型 定义
    receiveChannel.binaryType = 'arraybuffer'
    receiveChannel.onmessage = onReceiveMessageCallBack
    receiveChannel.onopen = onReceiveChannelStateChange
    receiveChannel.onclose = onReceiveChannelStateChange

    receivedSize = 0   //每次创建都清零
  }

  const onReceiveMessageCallBack = (event) => {
    //  缓存处理
    receiveBuffer.push(event.data)
    receivedSize += event.data.byteLength
    receiveProgress.value = receivedSize

    const file = filetInput.files[0]
    // 接收完成
    if (receivedSize === file.size) {
      const received = new Blob(receiveBuffer)
    //   缓存清空
      receiveBuffer = []

      let download = downloadRef.current
      download.href = URL.createObjectURL(received)
      download.download = file.name
      download.textContent = `点击下载'${file.name}'&(${file.size} bytes)`
      download.style.display = 'block'
    }
  }

  const onCreateOfferSuccess = async (desc) => {
    console.log(`localConnection创建Offer返回的SDP信息\n${desc.sdp}`)
    console.log('设置localConnection的本地描述start')
    try {
      await localConnection.setLocalDescription(desc)
      onSetLocalSuccess(localConnection)
    } catch (e) {
      onSetSessionDescriptionError(e)
    }

    try {
      await remoteConnection.setRemoteDescription(desc)
      onSetRemoteSuccess(remoteConnection)
    } catch (e) {
      onSetSessionDescriptionError(e)
    }

    try {
      const answer = await remoteConnection.createAnswer()
      onCreateAnswerSuccess(answer)
    } catch (e) {
      onCreateSessionDescriptionError(e)
    }
  }

  const onCreateAnswerSuccess = async (desc) => {
    console.log(`remoteConnection的应答Answer数据:\n${desc.sdp}`)
    console.log('remoteConnection设置本地描述开始:setLocalDescription')
    try {
      await remoteConnection.setLocalDescription(desc)
      onSetLocalSuccess(remoteConnection)
    } catch (e) {
      onSetSessionDescriptionError(e)
    }

    try {
      await localConnection.setRemoteDescription(desc)
      onSetRemoteSuccess(localConnection)
    } catch (e) {
      onSetSessionDescriptionError(e)
    }
  }

  const onLocalIceStateChange = (event) => {
    console.log(
      `localConnection连接的ICE状态: ${localConnection.iceConnectionState}`
    )
    console.log('ICE状态改变事件: ', event)
  }

  const onRemoteIceStateChange = (event) => {
    console.log(
      `remoteConnection连接的ICE状态: ${localConnection.iceConnectionState}`
    )
    console.log('ICE状态改变事件: ', event)
  }

  const onSetLocalSuccess = (pc) => {
    console.log(`${getName(pc)}设置本地描述完成:setLocalDescription`)
  }

  const onSetRemoteSuccess = (pc) => {
    console.log(`${getName(pc)}设置远端描述完成:setRemoteDescription`)
  }

  const getName = (pc) => {
    return pc === localConnection ? 'localConnection' : 'remoteConnection'
  }

  const onCreateSessionDescriptionError = (error) => {
    console.log(`创建会话描述SD错误: ${error.toString()}`)
  }

  const onSetSessionDescriptionError = (error) => {
    console.log(`设置会话描述SD错误: ${error.toString()}`)
  }

  const onLocalIceCandidate = async (event) => {
    try {
      if (event.candidate) {
        await remoteConnection.addIceCandidate(event.candidate)
        onAddIceCandidateSuccess(remoteConnection)
      }
    } catch (e) {
      onAddIceCandidateError(localConnection, e)
    }
    console.log(
      `IceCandidate数据:\n${
        event.candidate ? event.candidate.candidate : '(null)'
      }`
    )
  }

  const onRemoteIceCandidate = async (event) => {
    try {
      if (event.candidate) {
        await localConnection.addIceCandidate(event.candidate)
        onAddIceCandidateSuccess(localConnection)
      }
    } catch (e) {
      onAddIceCandidateError(remoteConnection, e)
    }
    console.log(
      `IceCandidate数据:\n${
        event.candidate ? event.candidate.candidate : '(null)'
      }`
    )
  }

  const onAddIceCandidateSuccess = (pc) => {
    console.log(`${getName(pc)}添加IceCandidate成功`)
  }

  const onAddIceCandidateError = (pc, error) => {
    console.log(`${getName(pc)}添加IceCandidate失败: ${error.toString()}`)
  }

  const sendData = () => {
    let file = filetInput.files[0]
    // progress bar
    sendProgress.max = file.size
    receiveProgress.max = file.size
    // 暂设置16k，自由定义
    let chunkSize = 16384
    fileReader = new FileReader()
    let offset = 0

    fileReader.addEventListener('error', (error) => {
      console.error('读取文件出错:', error)
    })

    fileReader.addEventListener('abort', (event) => {
      console.error('读取文件取消:', event)
    })

    // 加载
    fileReader.addEventListener('load', (e) => {
      sendChannel.send(e.target.result)

      offset += e.target.result.byteLength

      sendProgress.value = offset
    // 继续读取
      if (offset < file.size) {
        readSlice(offset)
      }
    })

    // 读取切片
    let readSlice = (o) => {
      let slice = file.slice(offset, o + chunkSize)
      fileReader.readAsArrayBuffer(slice)
    }
    readSlice(0) //读取切片从0开始
  }

  const closeChannel = () => {
    console.log('结束会话')
    sendChannel.close()
    if (receiveChannel) {
      receiveChannel.close()
    }
    localConnection.close()
    remoteConnection.close()
    localConnection = null
    remoteConnection = null
  }

  const cancelSendFile = () => {
    if (fileReader && fileReader.readyState === 1) {
      console.log('取消读取文件')
      fileReader.abort()
    }
  }

  return (
    <div className="container">
      <h1>
        <span>示例</span>
      </h1>
      <div>
        <form id="fileInfo">
          <input type="file" ref={fileInputRef} name="files" />
        </form>
        <div>
          <h2>发送</h2>
          <progress
            ref={sendProgressRef}
            max="0"
            value="0"
            style={{ width: '500px' }}
          ></progress>
        </div>
        <div>
          <h2>接收</h2>
          <progress
            ref={receiveProgressRef}
            max="0"
            value="0"
            style={{ width: '500px' }}
          ></progress>
        </div>
      </div>

      <a ref={downloadRef}></a>
      <Button onClick={startSendFile}>发送</Button>
      <Button onClick={cancelSendFile}>取消</Button>
      <Button onClick={closeChannel}>关闭</Button>
    </div>
  )
}

export default DataChannelFile
