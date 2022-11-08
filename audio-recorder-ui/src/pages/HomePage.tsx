import { IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { useParams, useHistory } from 'react-router';
import './HomePage.css';



const HomePage: React.FC = () => {

  const pageTitle = "Dalang Gathering";

  let history = useHistory();

  const routeChange = () => {
    const path = "/page/recordings";
    history.push(path);
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
          <IonTitle color="dark" style={{fontSize: "24px"}}>Repeat the phrase</IonTitle>
          <div style={{padding: "20px", paddingTop: "10px", lineHeight : "2rem"}}>
            <p>
              This section of the application helps you to compare your voice 🗣 with the instructor's voice stored in our database 💽. 
            </p>
            <p style={{fontSize : "20px", color: "GrayText"}}><b> STEPS TO FOLLOW </b></p>
            <ol>
              <li>
                Select an audio of your choice 🎼. 
              </li>
              <li>
                Listen carefully to the audio 👂. 
              </li>
              <li>
                Click <b>Record ⏺</b> button to open a recording modal.
              </li>
              <li>
                Click <b>Start Recording 🟢 </b> to start the recording. Try to avoid any background noises. 
              </li>
              <li>
                Click <b>Stop Recording 🛑 </b> to stop the recording.  
              </li>
              <li>
                If you want to re-do it, then click <b> Record Again 🔁</b> button.  
              </li>
              <li>
                If you want to proceed and see the score, press <b>Score 👍</b> button.
              </li>
              <li>
                Wait it may take few seconds to calculate your score ⚙️. 
              </li>
              <li>
                You can see the score now 🥳.
              </li>
            </ol>
          </div>
          <div style={{padding: "20px", paddingTop: "10px"}}>
            <IonButton size="default" expand='block' fill="solid" onClick={routeChange}>See the recordings</IonButton>
          </div>
        </div>
      </IonContent>


    </IonPage>
  );
};

export default HomePage;
