// interface Props {
//   audioString : string
// }; 

import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonItem, IonLabel, IonModal, IonButton, IonCheckbox } from "@ionic/react";

interface props {
  closeModal : () => void,
}

const MediaPlayer : React.FC<props> = (closeModal, audioName) => {

  const pageTitle = "Dalang Gathering"

  return (
    <>
      <IonContent className="ion-padding">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni illum quidem recusandae ducimus quos
          reprehenderit. Veniam, molestias quos, dolorum consequuntur nisi deserunt omnis id illo sit cum qui.
          Eaque, dicta.
        </p>
        <p>
          {audioName}
        </p>
      </IonContent>
  </>)
}

export default MediaPlayer;