import React from 'react';
import {List} from "antd";
import {Link} from 'react-router-dom';

const data = [
    {title:'HomePage',path:'/'},
    {title:'Camera',path:'/camera'},
    {title:'Microphone',path:'/microphone'},
    {title:'Capture Video',path:'/canvas'},
    {title:'Screen Sharing',path:'/screenSharing'},
    {title:'Video CSS Filters',path:'/videoFilter'},
    {title:'Video Resolution',path:'/resolution'},
    {title:'Audio Volume Test',path:'/audioVolume'},
    {title:'List of Devices',path:'/deviceSelect'},
    {title:'Media Settings',path:'/mediaSettings'},
    {title:'MediaStreamAPI Test',path:'/mediaStreamAPI'},
    {title:'Capture Video Stream',path:'/captureVideo'},
    {title:'Capture Canvas Stream',path:'/captureCanvas'},
    {title:'Record Audio',path:'/recordAudio'},
    {title:'Record Video',path:'/recordVideo'},
    {title:'Record Screen',path:'/recordScreen'},
    {title:'Record Canvas',path:'/recordCanvas'},
    {title:'RTCPeerConnection',path:'/peerConnection'},
    {title:'Remote Video Stream',path:'/peerConnectionVideo'},
    {title:'Remote Canvas Stream',path:'/peerConnectionCanvas'},
    {title:'Send Text through Data Channel',path:'/dataChannel'},
    {title:'Send File through Data Channel',path:'/dataChannelFile'},
];

class Samples extends React.Component{

    render(){
        return <div>
            <List 
                header={<div>WebRTC Samples</div>}
                footer={<div>Footer</div>}
                bordered
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <Link to={item['path']}>{item['title']}</Link>
                    </List.Item>
                )}>
                
            </List>
        </div>
    }

}

export default Samples;