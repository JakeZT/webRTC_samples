import React,{useRef,useEffect,useState} from "react";
import { Button, message } from "antd";

let mediaRecorder;

let recordedBlobs;

let stream;



const RecordScreen =()=> {
    const myVideoRef=useRef();
    const startCaptureScreen = async (e) => {

        try {
            stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    width: 2880, height: 1800
                },
                audio:true
            }

            );

            const video =myVideoRef.current

            window.stream = stream;
            video.srcObject = stream;

            startRecord();

        } catch (e) {
            console.log(e);
        }
    }

    const startRecord = (e) => {
        // 不活动状态，停止共享屏幕那个停止按钮
        stream.addEventListener('inactive',e =>{
            stopRecord(e);
        });

        recordedBlobs = [];

        try {
            mediaRecorder = new MediaRecorder(window.stream, { mineType: 'video/webm' });
        } catch (e) {
            console.log("MediaRecorder:", e);
            return;
        }

        mediaRecorder.onstop = (event) => {
            console.log('Recorder stopped:', event);
            console.log('Recorder blobs:', recordedBlobs);
        }

        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start(10);

    }
    const handleDataAvailable = (event) => {

        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }

    const stopRecord = (e) => {
        mediaRecorder.stop();
        
        const blob = new Blob(recordedBlobs, { type: 'video/webm' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = 'screen.webm';
        document.body.appendChild(link);
        link.click();//调用下载
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);
       
    }


  
        return (
            <div className="container">
                <h1>
                    <span>示例</span>
                </h1>

                <video className="video" ref={myVideoRef} playsInline autoPlay></video>

                <Button
                    className="button"
                    onClick={startCaptureScreen}
                    >
                    开始
            </Button>
                <Button
                    className="button"
                    onClick={stopRecord}
                    >
                    停止
            </Button>
            </div>
        );

}

export default RecordScreen;