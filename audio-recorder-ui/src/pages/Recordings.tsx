import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonModal, useIonAlert, IonText, RefresherEventDetail, IonRefresher, IonRefresherContent } from "@ionic/react";
import "./Recordings.css";
import * as fs from 'fs'; 
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';


const Recordings : React.FC = () => {

  const pageTitle = "Dalang Gathering"; 

  const [fileNamesArray, setFileNamesArray] = useState([]);
  const [isOpen, setIsOpen] = useState(false); 
  const [audio, setAudio] = useState({
    name : "", 
    url : "", 
  }); 
  const [presentAlert] = useIonAlert();

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

  const closeModalHandler = () => {
    setIsOpen(false); 
    setAudio({
      name : "", 
      url : ""
    })
  }

  const openModalHandler = () => {
    console.log("click");
    console.log(isOpen);
    setIsOpen(true); 
    console.log(isOpen);
  }

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      // Any calls to load data go here
      fileNamesRequest(); 
      event.detail.complete();
    }, 6000);
  }


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
                      setAudio({
                        name : file, 
                        url : `https://dalanggatheringbucket.s3.us-west-1.amazonaws.com/audio+data/${file.replace(" ", "+")}`
                      })
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
            
            <p><b>Audio name</b> : {audio.name}</p>
            
            <AudioPlayer
              src={audio.url}
              onPlay={e => console.log("onPlay")}
              showSkipControls = {false}
            />
             
            </IonContent>
          </IonModal>
        </div>

      </IonContent>
    </IonPage>)
};

export default Recordings; 

