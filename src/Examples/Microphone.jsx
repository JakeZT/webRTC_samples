import React,{useRef,useEffect} from "react";


const constraints = window.constraints ={
    audio:true,
    video:false
}

function Microphone(){
const audioRef=useRef()
    
    useEffect(()=>{
        openCamera();
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
        const audioTracks = stream.getAudioTracks();
        console.log('使用的设备是:' + audioTracks[0].label);
        window.stream = stream;
        audioRef.current.srcObject = stream;
    }

    const handleError=(error)=>{
        console.log('getUserMedia error:' ,error.message,error.name);
    }
    return(
            <div className="container">
            <h1>
              <span>麦克风示例</span>
            </h1>
            <audio ref={audioRef} controls autoPlay ></audio>
          </div>   
        );
}

export default Microphone;