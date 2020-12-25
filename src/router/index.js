import React, { Fragment, lazy, Suspense } from 'react';
import { renderRoutes } from 'react-router-config';
const Samples=lazy(()=>import("../Examples/Samples"));
const Camera=lazy(()=>import("../Examples/Camera"));
const Microphone=lazy(()=>import("../Examples/Microphone"));
const Canvas=lazy(()=>import("../Examples/Canvas"));
const VideoFilter =lazy(()=>import('../Examples/VideoFilter' )) ;
const Resolution =lazy(()=>import( '../Examples/Resolution')) ;
const AudioVolume =lazy(()=>import( '../Examples/volume/AudioVolume')) ;
const DeviceSelect =lazy(()=>import( '../Examples/DeviceSelect' ));
const MediaSettings =lazy(()=>import( '../Examples/media-settings/MediaSetting')) ;
const MediaStreamAPI =lazy(()=>import( '../Examples/MediaStreamAPI' ));
const CaptureVideo =lazy(()=>import( '../Examples/CaptureVideo')) ;
const CaptureCanvas =lazy(()=>import( '../Examples/CaptureCanvas'));
const RecordAudio =lazy(()=>import( '../Examples/RecordAudio'));
const RecordVideo =lazy(()=>import('../Examples/RecordVideo' )) ;
const RecordScreen =lazy(()=>import('../Examples/RecordScreen' )) ;
const RecordCanvas =lazy(()=>import( '../Examples/RecordCanvas')) ;
const ScreenSharing =lazy(()=>import( '../Examples/ScreenShare')) ;
const PeerConnection =lazy(()=>import('../Examples/PeerConnection' )) ;
const PeerConnectionVideo =lazy(()=>import('../Examples/PeerConnectionVideo' )) ;
const PeerConnectionCanvas =lazy(()=>import('../Examples/PeerConnectionCanvas' )) ;
const DataChannel =lazy(()=>import(  '../Examples/DataChannel'));
const DataChannelFile =lazy(()=>import( '../Examples/DataChannelFile')) ;
const NotFoundComponent=lazy(()=>import ('../Examples/Error'))


const SuspenseComponent = Component => props => {
  // console.log(props);
  return (
    <Suspense fallback={<div>Loading... </div>}>
      <Component {...props}></Component>
      
    </Suspense>
  )
}
// export default [
const RouterConfig=
  [
      {
        path: "/",
        exact: true,
        component: Samples,

        },
      {
        path: "/camera",
        component:Camera
      },
      {
      path: "/microphone",
      component: SuspenseComponent(Microphone),
    },
    {
      path: "/canvas",
      component: SuspenseComponent(Canvas),
    },
    {
      path: "/screenSharing",
      component: SuspenseComponent(ScreenSharing),
    },
    {
      path: "/videoFilter",
      component: SuspenseComponent(VideoFilter),
      key: "videoFilter",
    },
    {
      path: "/resolution",
      component: SuspenseComponent(Resolution),
      key: "resolution",
    },
    {
      path: "/audioVolume",
      key: "audioVolume",
      component: SuspenseComponent(AudioVolume),
      // component: PlayerComponent,
    },
    {
      path: "/deviceSelect",
      key: "deviceSelect",
      component: SuspenseComponent(DeviceSelect)
    },
    {
      path: "/mediaSettings",
      key: "mediaSettings",
      component: SuspenseComponent(MediaSettings)
    },
    {
      path: "/mediaStreamAPI",
      key: "mediaSettings",
      component: SuspenseComponent(MediaStreamAPI)
    },
    {
      path: "/captureVideo",
      key: "captureVideo",
      component: SuspenseComponent(CaptureVideo)
    },
    {
      path: "/captureCanvas",
      key: "captureCanvas",
      component: SuspenseComponent(CaptureCanvas)
    },
    {
      path: "/recordAudio",
      key: "recordAudio",
      component: SuspenseComponent(RecordAudio)
    },
    {
      path: "/recordVideo",
      key: "recordVideo",
      component: SuspenseComponent(RecordVideo)
    },
    {
      path: "/recordScreen",
      key: "recordScreen",
      component: SuspenseComponent(RecordScreen)
    },
    {
      path: "/recordCanvas",
      key: "recordCanvas",
      component: SuspenseComponent(RecordCanvas)
    },
    {
      path: "/peerConnection",
      key: "peerConnection",
      component: SuspenseComponent(PeerConnection)
    },
    {
      path: "/peerConnectionVideo",
      key: "peerConnectionVideo",
      component: SuspenseComponent(PeerConnectionVideo)
    },
    {
      path: "/peerConnectionCanvas",
      key: "peerConnectionCanvas",
      component: SuspenseComponent(PeerConnectionCanvas)
    },
    {
      path: "/dataChannel",
      key: "dataChannel",
      component: SuspenseComponent(DataChannel)
    },
    {
      path: "/dataChannelFile",
      key: "dataChannelFile",
      component: SuspenseComponent(DataChannelFile)
    },
    {
      path: "*",
      key: "NotFound",
      component: SuspenseComponent(NotFoundComponent)
    }
  ]

  
  function RouteList(){
    return(
      <Fragment>
 {renderRoutes(RouterConfig)}
  </Fragment>
)
}
export default RouteList;