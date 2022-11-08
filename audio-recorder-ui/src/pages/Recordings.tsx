import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonModal } from "@ionic/react";
import "./Recordings.css";
import * as fs from 'fs'; 
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import MediaPlayer from "./MediaPlayer";


const Recordings : React.FC = () => {

  const pageTitle = "Dalang Gathering"; 

  const [fileNamesArray, setFileNamesArray] = useState([]);
  const [isOpen, setIsOpen] = useState(false); 
  const [audioName, setAudioName] = useState(""); 

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
    setAudioName("");
  }

  const openModalHandler = () => {
    console.log("click");
    console.log(isOpen);
    setIsOpen(true); 
    console.log(isOpen);
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
          <IonTitle color="dark" style={{fontSize: "24px"}}>Recording Lists</IonTitle>
          <div style={{padding: "20px", paddingTop: "10px", lineHeight : "2rem"}}>
            <p>
              List of all the recordings 🎧 
            </p>
            
            <div className="recordings">
              {
                fileNamesArray.map(
                  (file : string, index : number) => (
                    <IonItem key={index} button detail lines="full"  onClick = {() => {
                      setIsOpen(true);
                      setAudioName(file)
                      }}>
                      <IonLabel>{file}</IonLabel>
                    </IonItem>
                  )
                )
              }
            </div>
          </div>
          <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)} canDismiss={true}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Recorder 🎙</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni illum quidem recusandae ducimus quos
                reprehenderit. Veniam, molestias quos, dolorum consequuntur nisi deserunt omnis id illo sit cum qui.
                Eaque, dicta.
              </p>
              <p>{audioName}</p>
             
            </IonContent>
          </IonModal>
        </div>

      </IonContent>
    </IonPage>)
};

export default Recordings; 

