import React,{useRef,useEffect} from "react";
import { Button, message,Select } from "antd";
const { Option } = Select;

/* 
The reason for the difference in behavior is that the keywords min, max, and exact are inherently mandatory.
 Whereas plain values and a keyword called ideal are not. Here's a full example:

{
  audio: true,
  video: {
    width: { min: 1024, ideal: 1280, max: 1920 },
    height: { min: 576, ideal: 720, max: 1080 }
  }
}

*/
const q_vgaConstraints = {
    video: { width: { exact: 320 }, height: { exact: 240 } },
    audio:false
};

const vgaConstraints = {
    video: { width: { exact: 640 }, height: { exact: 480 } },
    audio:false
};

const hdConstraints = {
    video: { width: { min: 1280 }, height: { min: 720 } },
    audio:false
};

const fullHdConstraints = {
    video: { width: { min: 1920 }, height: { min: 1080 } },
    audio:false
};

const twoKConstraints = {
    video: { width: { min: 2560 }, height: { min: 1440 } },
    audio:false
};

const fourKConstraints = {
    video: { width: { min: 4096 }, height: { min: 2160 } },
    audio:false
};

const eightKConstraints = {
    video: { width: { min: 7680 }, height: { min: 4320 } },
    audio:false
};

let stream;
let video;

const Resolution=()=>{
const videoRef=useRef();
useEffect(()=>{
    video=videoRef.current;
    getMedia(vgaConstraints)
},[])

    const getMedia = (constraints=0) => {
        if(constraints===0) return;
        if (stream) {
            stream.getTracks().forEach(track => {
                track.stop();
            });
        }
        navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(e => {
            handleError(e);
        });

    }

    const gotStream = (mediaStream) => {
        stream = window.stream = mediaStream;
        video.srcObject = stream;
    }

    const handleError=(error) =>{
        console.log('getUserMedia错误:', error);
        message.error('Your camera doesn\'t support this constraint.')
    }

    const handChange = (value) => {
        switch (value) {
            case 'qvga':
                getMedia(q_vgaConstraints);
                break;
            case 'vga':
                getMedia(vgaConstraints);
                break;
            case 'hd':
                getMedia(hdConstraints);
                break;
            case 'fullhd':
                getMedia(fullHdConstraints);
                break;
            case '2k':
                getMedia(twoKConstraints);
                break;
            case '4k':
                getMedia(fourKConstraints);
                break;
            case '8k':
                getMedia(eightKConstraints);
                break;
            default:
                getMedia(vgaConstraints);
                break;
        }
    }

    const dynamicChange = (e) => {
        const track = window.stream.getVideoTracks()[0];
        console.log(window.stream.getVideoTracks());
        let constraints = vgaConstraints;
        track.applyConstraints(constraints)
        .then(() => {
            console.log("动态改变分辨率成功...");
        }).catch(err => {
            console.log("动态改变分辨率错误...",err.name);
        })
    }



        return (
            <div className="container">
                <h1>
                    <span>摄像头示例</span>
                </h1>
                <video className="video" ref={videoRef} autoPlay playsInline></video>
                <Select defaultValue="vga" style={{ width: '100px', marginLeft: '20px' }} onChange={handChange}>
                    <Option value="qvga">QVGA</Option>
                    <Option value="vga">VGA</Option>
                    <Option value="hd">高清</Option>
                    <Option value="fullhd">超清</Option>
                    <Option value="2k">2K</Option>
                    <Option value="4k">4K</Option>
                    <Option value="8k">8K</Option>
                </Select>
                <Button onClick={dynamicChange}>动态设置</Button>
            </div>
        );

}

export default Resolution;