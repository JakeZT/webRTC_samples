import React,{useRef,useEffect} from "react";
import {Button,message} from "antd";
import '../styles/css/canvas.scss';


const constraints = window.constraints ={
    audio:false,
    video:true
}


function Canvas(){
    const videoRef=useRef();
    const canvasRef=useRef();
    useEffect(()=>{
        openCamera() 
    },[])


    const openCamera = async (e) =>{

        try{
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log('success');
            handleSuccess(stream);

        }catch(e){
            handleError(e);
        }

    }

    const handleSuccess = (stream) =>{
        
        window.stream = stream;
        videoRef.current.srcObject = stream;
    }

    const handleError=(error)=>{
        if(error.name === 'ConstraintNotSatisfiedError'){
            const v = constraints.video;
            message.error(`宽:${v.width.exact} 高:${v.height.exact} 设备不支持`);
        } else if(error.name === 'PermissionDeniedError'){
            message.error('没有摄像头和麦克风的使用权限,请点击允许按钮');
        }
        message.error('getUserMedia错误:',error);
    }

    const takeSnap = async (e) => {
        let canvas = canvasRef.current
        console.log(videoRef.current.videoWidth)
        console.log(canvasRef)
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current,0,0,canvas.width,canvas.height);
    }



        return(
            <div className="container">
            <h1>
              <span>截取视频示例</span>
            </h1>
            <video className="small-video" ref={videoRef} autoPlay playsInline></video>
            <canvas className="small-canvas" ref={canvasRef}></canvas>
            <Button onClick={takeSnap}>截屏</Button>
          </div>   
        );
    

}

export default Canvas;