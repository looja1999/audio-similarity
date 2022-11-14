import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonModal, useIonAlert, IonText, RefresherEventDetail, IonRefresher, IonRefresherContent } from "@ionic/react";
import "./Recordings.css";
import { useEffect, useState } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import useMediaRecorder from '@wmik/use-media-recorder';
import { Upload } from '@aws-sdk/lib-storage';
import { S3Client } from '@aws-sdk/client-s3';
import { blob } from "stream/consumers";
import { type } from "os";
import MicRecorder from "./MicRecorder";

const Recordings : React.FC = () => {

  const pageTitle = "Dalang Gathering"; 

  const [fileNamesArray, setFileNamesArray] = useState([]);
  const [isOpen, setIsOpen] = useState(false); 
  const [audioData, setAudioData] = useState({
    name : "", 
    url : "", 
  }); 
  const [mediaBlobStatus, setMediaBlobStatus] = useState(false); 
  const [isPlaying, setIsPlaying] = useState(false);

  let {
    error,
    status,
    mediaBlob,
    stopRecording,
    getMediaStream,
    startRecording
  } = useMediaRecorder({
    blobOptions: { type: 'audio/wav' },
    mediaStreamConstraints: { audio: true }
  });


  
  
  const fileNamesRequest = async () => {
    const response = await fetch("http://127.0.0.1:8000/get-files");
    const data = await response.json(); 

    const index = data["file names"].indexOf(".DS_Store");
    data["file names"].splice(index, 1); 

    setFileNamesArray(data["file names"])
  }

  useEffect(() => {
    fileNamesRequest();
  }, [])

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      // Any calls to load data go here
      fileNamesRequest(); 
      event.detail.complete();
    }, 6000);
  }

    // // Uploading file to aws s3 bucket (bucket name dalang gathering.)
    // const uploadFile = async (file : any) => {

    //   const target = { Bucket : "dalanggatheringbucket", Key : file.name, Body : file}; 
    //   let uploadInfo; 

    //   try {
    //     const parallelUploads3 = await new Upload({
    //       client : new S3Client({region : "us-west-1", credentials : {
    //         accessKeyId : "AKIAYVCSIYKQODE3HR7S",
    //         secretAccessKey : "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"
    //       }}),
    //       leavePartsOnError : false, 
    //       params : target
    //     }); 
  
    //     await parallelUploads3.on("httpUploadProgress", (progress) => {
    //       uploadInfo = progress; 
    //       // console.log(progress); 
    //     }); 
  
    //     parallelUploads3.done(); 
    //     return uploadInfo; 

    //   } catch (e) {
    //     console.log(e); 
    //   }
    // }
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{pageTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{pageTitle}</IonTitle>
          </IonToolbar>
        </IonHeader>
      
        <div style={{marginTop: "32px", marginLeft: "3px"}}>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonTitle color="dark" style={{fontSize: "24px"}}>Recording Lists</IonTitle>
          <div style={{padding: "20px", paddingTop: "10px", lineHeight : "2rem"}}>
            <p>
              List of all the recordings 🎧 
            </p>
            
            <div className="recordings">
              { 
                fileNamesArray.length > 0 &&
                fileNamesArray.map(
                  (file : string, index : number) => (
                    <IonItem key={index} button detail lines="full"  onClick = {() => {
                      setIsOpen(true);
                      setAudioData({
                        name : file, 
                        // url : `https://dalanggatheringbucket.s3.us-west-1.amazonaws.com/audio+data/${file.replace(" ", "+")}`
                        url : `https://dalanggatheringbucket.s3.us-west-1.amazonaws.com/audio+data/${file.split(" ").join("+")}`
                      }); 
                      console.log(file.split(" ").join("+"))
                      setMediaBlobStatus(false); 
                      }}>
                      <IonLabel>{file}</IonLabel>
                    </IonItem>
                  )
                )
              }
            </div>

            <div className="recordings">
              { 
                fileNamesArray.length === 0 &&
                (
                  <IonLabel>
                    <IonText color="danger">Error while loading audio files.</IonText>
                  </IonLabel>
                )
              }
            </div>
          </div>
          <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)} canDismiss={true}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Check Similarity ✅</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
            
            <p><b>Audio name</b> : {audioData.name}</p>
            
            <AudioPlayer
              src={audioData.url}
              onPlay={e => {
                console.log(e)
                setIsPlaying(true); 
              }}
              onPause={e => setIsPlaying(false)}
              onAbort={e => setIsPlaying(false)}
              showSkipControls = {false}
              
            />

            <MicRecorder audioName = {audioData.name} isPlaying = {isPlaying} />
           
            </IonContent>
          </IonModal>
        </div>

      </IonContent>
    </IonPage>)
};

export default Recordings; 

