import { IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import './PageHeader.css'; 


const PageHeader : React.FC = () => {
  return (
    <IonHeader translucent={true}>
      <IonToolbar>
        <IonTitle>Dalang Gathering</IonTitle>
      </IonToolbar>
    </IonHeader>
  )
}

export default PageHeader; 