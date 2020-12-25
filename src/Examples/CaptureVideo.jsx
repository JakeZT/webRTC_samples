import React,{useRef} from "react";

//? 问题 如果单独获取音频，并使用
const constraints = window.constraints ={
    audio:false,
    video:true
}
//  
const CaptureVideo=()=>{
    const sourceVideo=useRef();
    const playerVideo=useRef();


    const canPlay = () => {
        const sourceVideoR = sourceVideo.current
        const playerVideoR = playerVideo.current
        // console.log(sourceVideo)
        let stream;
/* 也可以多个数据源连接到这个流，并且还可以与该new MediaStream([stream1, stream2])构造另一个视频流结合起来 */
        //frame per second
        const fps = 0;

        stream = sourceVideoR.captureStream(fps); //如果是firefox,则需要用mozCaptureStream捕获，需要兼容
        // console.log(stream.getAudioTracks())
        // let audioStream=stream.getAudioTracks()[0]
        // let ctx = new AudioContext(); 
        // var source = ctx.createMediaElementSource(sourceVideoR); 
        // let stream_dest = ctx.createMediaStreamDestination();
        // source.connect(stream_dest); 
        // audioStream.connectToSource(stream)
        // playerVideoR.srcObject = stream_dest.stream;
        playerVideoR.srcObject = stream;
    }

        return(
            <div className="container">
            <h1>
              <span>Example</span>
            </h1>
            <video className="video" ref={sourceVideo} controls loop muted playsInline onCanPlay={canPlay}>
                <source src="./assets/webrtc.mp4" type="video/mp4"/>
            </video>
            <video className="video" ref={playerVideo}  playsInline autoPlay></video>
          </div>   
        );
}

export default CaptureVideo;