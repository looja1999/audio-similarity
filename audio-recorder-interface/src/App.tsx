import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact, IonContent, IonTitle, IonButton} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import useMediaRecorder from '@wmik/use-media-recorder';
import ReactS3Client from 'react-aws-s3-typescript';

import { Upload } from '@aws-sdk/lib-storage';
import { S3Client, S3 } from '@aws-sdk/client-s3';


const s3Config = {
  bucketName:  'dalanggatheringbucket',
  region: 'us-west-1',
  accessKeyId:'AKIAYVCSIYKQODE3HR7S',
  secretAccessKey: 'PSrKifmXdJgMWjmX4vi3Jo4npfFGFa5hhoLcSV4U+5GhIjKLm6nOpqr7stuVwxy8ZA9bC0',
}

setupIonicReact();

  // Uploading file to aws s3 bucket (bucket name dalang gathering.)
  const uploadFile = async (file : any) => {

    const target = { Bucket : "dalanggatheringbucket", Key : file.name, Body : file}; 

    try {
      const parallelUploads3 = await new Upload({
        client : new S3Client({region : "us-west-1", credentials : {
          accessKeyId : "AKIAYVCSIYKQODE3HR7S",
          secretAccessKey : "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"
        }}),
        leavePartsOnError : false, 
        params : target
      }); 

      await parallelUploads3.on("httpUploadProgress", (progress) => {
        console.log(progress); 
      }); 

      parallelUploads3.done(); 

    } catch (e) {
      console.log(e); 
    }
  }


const App: React.FC = () => {
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
  


  const onSubmitClick =  async () => {
    if (mediaBlob){
      console.log(mediaBlob); 

      const fileBlob = new Blob([mediaBlob]); 
      const file = new File([fileBlob], "looja1.wav", { type : "audio/wav"}); 

      uploadFile(file); 
    }
  }

  return (
    <IonApp>
      <IonContent>
        <IonTitle>
          Hello
        </IonTitle>
        <IonButton onClick={() => startRecording()}>Start Recording</IonButton>
        <IonButton onClick={() => stopRecording()}>Stop Recording</IonButton>
        <IonButton onClick={() => onSubmitClick()}>Submit</IonButton>
        <audio src="https://dalanggatheringbucket.s3.us-west-1.amazonaws.com/looja1.wav" controls> </audio>
      </IonContent>
    </IonApp>
  );
};

export default App; 

