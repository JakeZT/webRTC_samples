import React,{useRef,useEffect} from "react";
import { Button, message, Select } from "antd";
import '../styles/css/video-filter.scss';

const { Option } = Select;
const constraints = (window.constraints = {
    video: true,
    audio: false,
  })
const VideoFilter=()=> {
    let video=null;
    const videoRef=useRef();
    
    useEffect(()=>{
        video = videoRef.current;
        const constraints = {
            audio: false,
            video: true
        }

        navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch((err)=>{handleError(err)});
    },[])



    const handleSuccess = (stream) => {
        window.stream = stream;
        video.srcObject = stream;
    }

    const handleError=(error)=>{
        if (error.name === 'ConstraintNotSatisfiedError') {
            const v = constraints.video;
            message.error(`宽:${v.width.exact} 高:${v.height.exact} 设备不支持`);
        } else if (error.name === 'PermissionDeniedError') {
            message.error('没有摄像头和麦克风的使用权限,请点击允许按钮');
        }
        message.error('getUserMedia错误:', error);
    }

    const handChange = (value) => {
        video.className = value;
    }


        return (
            <div className="container">
                <h1>
                    <span>视频滤镜示例</span>
                </h1>
                <video ref={videoRef} autoPlay playsInline></video>
                <Select defaultValue="none" style={{ width: '100px' }} onChange={handChange}>
                    <Option value="none">没有滤镜</Option>
                    <Option value="blur">模糊</Option>
                    <Option value="grayscale">灰度</Option>
                    <Option value="invert">反转</Option>
                    <Option value="sepia">深褐色</Option>
                </Select>
            </div>
        );
}

export default VideoFilter;