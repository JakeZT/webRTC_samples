import React,{useEffect,useRef} from "react";
import '../styles/css/capture-canvas.scss';

let stream;
let canvas;
let context;

const CaptureCanvas=()=>{
    const canvasRef=useRef();
    const videoRef=useRef();
    useEffect(()=>{
        canvas = canvasRef.current
        startCaptureCanvas();
    })

    const startCaptureCanvas = async (e) => {
       
        // 每秒10张
        stream = canvas.captureStream(10);
        const video = videoRef.current
        video.srcObject = stream;
        drawLine();
    }
    // 划线
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

 
        return(
            <div className="container">
            <h1>
              <span>Example</span>
            </h1>
            <div className="small-canvas">
            {/* canvas大小用div控制 */}
                <canvas ref={canvasRef}></canvas>
            </div>
            <video className="small-video" ref={videoRef}  playsInline autoPlay></video>
          </div>   
        );


}

export default CaptureCanvas;