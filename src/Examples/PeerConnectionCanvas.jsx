import React,{useState,useRef,useEffect} from "react";
import {Button,message} from "antd";
import '../styles/css/pc-canvas.scss';


let canvas;
let context;

let localVideo;
let remoteVideo;
let localStream;
let peerConnA;
let peerConnB;

const PeerConnectionCanvas =()=>{
    const remoteVideoRef=useRef()
    const canvasRef=useRef()

    useEffect(() => {
        remoteVideo = remoteVideoRef.current;
        canvas =canvasRef.current;
        startCaptureCanvas();
        return () => {
           
        };
    }, []);


    const startCaptureCanvas = async (e) => {
        // 抓取canvas流
        localStream = canvas.captureStream(10);
    
        drawLine();
    }

    const drawLine = () => {
        context = canvas.getContext('2d');

        context.fillStyle = '#CCC';
        context.fillRect(0,0,320,240);

        context.lineWidth = 1;
        context.strokeStyle = "#FF0000";

        canvas.addEventListener("mousedown",startAction);
        canvas.addEventListener("mouseup",endAction);
    }

    const startAction = (event) => {
        context.beginPath();
        context.moveTo(event.offsetX,event.offsetY);
        context.stroke();

        canvas.addEventListener("mousemove",moveAction);
    }


    const moveAction = (event) => {
        context.lineTo(event.offsetX,event.offsetY);
        context.stroke();
    }

    const endAction = (event) => {
        canvas.removeEventListener("mousemove",moveAction);
    }

    

    const call = async () => {

        //视频轨道
        const videoTracks = localStream.getVideoTracks();
        //音频轨道
        const audioTracks = localStream.getAudioTracks();
        //判断视频轨道是否有值
        if (videoTracks.length > 0) {
        //输出摄像头的名称
        console.log(`使用的视频设备为: ${videoTracks[0].label}`);
        }
        //判断音频轨道是否有值
        if (audioTracks.length > 0) {
        //输出麦克风的名称
        console.log(`使用的音频设备为: ${audioTracks[0].label}`);
        }
        // 设置iceServer, 使用google服务器
        let configuration = {"iceServers":[{ "url": "stun:stun.l.google.com:19302" }]};

        peerConnA = new RTCPeerConnection(configuration);
        peerConnA.addEventListener('icecandidate',onIceCandidateA);// A发送candidate给B

        peerConnB = new RTCPeerConnection(configuration);
        peerConnB.addEventListener('icecandidate',onIceCandidateB);// B发送candidate给A

        peerConnA.addEventListener('iceconnectionstatechange',onIceStateChangeA);//监听状态变化
        peerConnB.addEventListener('iceconnectionstatechange',onIceStateChangeB);

        peerConnB.addEventListener('track',gotRemoteStream);//获取到远端流以后

        localStream.getTracks().forEach((track) => {//将流添加进
            peerConnA.addTrack(track,localStream);
        });

        try{
            // A生成offer提议，希望B应答
            const offer = await peerConnA.createOffer();
            await onCreateOfferSuccess(offer);

        }catch(e){
            onCreateSessionDescriptionError(e);
        }

    }


    const onCreateOfferSuccess =  async (desc) => {
        /* 
        提议/应答输出的是SDP信息，即媒体协商信息，如分辨率、格式、编码、加密算法等。
        由于SDP的内容非常多，所以这里只展示了部分数据。SDP信息交换通过信息服务器完成。
         */
        console.log(`peerConnA创建Offer返回的SDP信息\n${desc.sdp}`);
        console.log('设置peerConnA的本地描述start');
        try{
            // 设置本地描述
           await peerConnA.setLocalDescription(desc);
           onSetLocalSuccess(peerConnA);

        }catch(e){
            onSetSessionDescriptionError(e);
        }

        try{
            // B设置远程描述
            await peerConnB.setRemoteDescription(desc);
            onSetRemoteSuccess(peerConnB);
 
         }catch(e){
            onSetSessionDescriptionError(e);
         }



         try{
            //  B生成Answer应答
            const answer = await peerConnB.createAnswer();
            onCreateAnswerSuccess(answer);
 
         }catch(e){
            onCreateSessionDescriptionError(e);
         }


    }


    const onCreateAnswerSuccess =  async (desc) => {
        console.log(`peerConnB的应答Answer数据:\n${desc.sdp}`);
        console.log('peerConnB设置本地描述开始:setLocalDescription');
        try{
            // B设置本地描述
            await peerConnB.setLocalDescription(desc);
            onSetLocalSuccess(peerConnB);
 
         }catch(e){
            onSetSessionDescriptionError(e);
         }
 

         try{
            //  A生成远端描述
             await peerConnA.setRemoteDescription(desc);
             onSetRemoteSuccess(peerConnA);
  
          }catch(e){
            onSetSessionDescriptionError(e);
          }

    }

    const onIceStateChangeA = (event) =>{
        console.log(`peerConnA连接的ICE状态: ${peerConnA.iceConnectionState}`);
        console.log('ICE状态改变事件: ', event);
    }

    const onIceStateChangeB = (event) =>{
        console.log(`peerConnB连接的ICE状态: ${peerConnA.iceConnectionState}`);
        console.log('ICE状态改变事件: ', event);
    }


    const onSetLocalSuccess = (pc) => {
        console.log(`${getName(pc)}设置本地描述完成:setLocalDescription`);
    }


    const onSetRemoteSuccess = (pc) => {
        console.log(`${getName(pc)}设置远端描述完成:setRemoteDescription`);
    }

    const getName = (pc) =>{
        return (pc === peerConnA)?'peerConnA':'peerConnB';
    }

    const onCreateSessionDescriptionError = (error) => {
        console.log(`创建会话描述SD错误: ${error.toString()}`);
    }

    const onSetSessionDescriptionError = (error) => {
        console.log(`设置会话描述SD错误: ${error.toString()}`);
    }

    // A添加candidate
    const onIceCandidateA = async (event) => {
        try{
            if(event.candidate){
                await peerConnB.addIceCandidate(event.candidate);
                onAddIceCandidateSuccess(peerConnB);
            }
        } catch(e){
            onAddIceCandidateError(peerConnA, e);
        }
        /* 
        建立起连接后，除了可以看到媒体协商信息SDP，还可以看到网络协商信息Candidate，主要包含IP及端口信息。
        端口是不断变化的
        */
        console.log(`IceCandidate数据:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
    }
    // B添加candidate
    const onIceCandidateB = async (event) => {
        try{
            if(event.candidate){
                await peerConnA.addIceCandidate(event.candidate);
                onAddIceCandidateSuccess(peerConnA);
            }
        } catch(e){
            onAddIceCandidateError(peerConnB, e);
        }
        console.log(`IceCandidate数据:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
    }

    const onAddIceCandidateSuccess = (pc) => {
        console.log(`${getName(pc)}添加IceCandidate成功`);
    }

    const onAddIceCandidateError = (pc,error) =>{
        console.log(`${getName(pc)}添加IceCandidate失败: ${error.toString()}`);
    }




    const gotRemoteStream = (e) =>{
        // 远端流加入 本地流
        if(remoteVideo.srcObject !== e.streams[0]){
            remoteVideo.srcObject = e.streams[0];
        }
    }

    const hangup = () =>{
        console.log('结束会话');
        peerConnA.close();
        peerConnB.close();
        peerConnA = null;
        peerConnB = null;
    }


        return(
            <div className="container">
            <h1>
              <span>示例</span>
            </h1>
            <div className="small-canvas">
                <canvas ref={canvasRef}></canvas>
            </div>
            <video className="small-video" ref={remoteVideoRef}  playsInline autoPlay></video>
            <div>
                <Button onClick={call}>呼叫</Button>
                <Button onClick={hangup}>挂断</Button>
            </div>
          </div>   
        );

}

export default PeerConnectionCanvas;