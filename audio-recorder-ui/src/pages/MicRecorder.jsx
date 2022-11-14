import MicRecorder from "mic-recorder-to-mp3";
import React from "react";
import { IonButton, IonSpinner } from "@ionic/react";
import ProgressBar from 'react-animated-progress-bar';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

class AudioRecorder extends React.Component {
  constructor(props) {
    super(props);
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    this.state = {
      isRecording: false,
      isPaused: false,
      blobURL: "",
      isBlocked: false,
      result : 0, 
      isLoading : false
    };
  }

  startRecording = () => {
    if (this.state.isBlocked) {
      console.log("Please give permission for the microphone to record audio.");
    } else {
      Mp3Recorder.start()
        .then(() => {
          console.log("Recording");
          this.setState({ isRecording: true });
        })
        .catch(e => console.error(e));
    }
    this.setState({
      isLoading : false
    })
  };

  stopRecording = () => {
    this.setState({ isRecording: false });
    Mp3Recorder.stop()
      .getMp3()
      .then(async ([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        this.setState({ 
          blobURL: blobURL,
          isRecording: false
        });
      })
      .catch(e => console.log(e));
  };

  sendAudio = async () => {
    this.setState({
      isLoading : true
    }); 
    const formData = new FormData(); 
        
    let audioBlob = await fetch(this.state.blobURL).then(r => r.blob()); 
    formData.append("file", audioBlob, `${this.props.audioName.slice(0, -4)}`);

    const response = await fetch("http://127.0.0.1:8000/upload", {
      method : "POST", 
      body : formData
    }); 

    const data = await response.json();
    
    this.setState({
      isLoading : false
    });

    this.setState({
      result : data.Similarity,
    }); 
 
  }

  checkPermissionForAudio = () => {
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        // First get ahold of the legacy getUserMedia, if present
        var getUserMedia =
          // navigator.getUserMedia ||
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
          return Promise.reject(
            new Error("getUserMedia is not implemented in this browser")
          );
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        this.setState({ isBlocked: false });
      })
      .catch(err => {
        this.setState({ isBlocked: true });
        console.log("Please give permission for the microphone to record audio.");      
        console.log(err.name + ": " + err.message);
      });
  };

  componentDidMount() {
    this.checkPermissionForAudio();
  }

  render() {
    const { isRecording } = this.state;
    return (
      <React.Fragment>

        {/* Inital Recording */}
        {!isRecording  && <p style={{paddingTop: "16px", textAlign: "center"}}>Click <b>Start Recording</b> to start recording. </p>}
        {!isRecording  && <IonButton color="success" expand="block" onClick={this.startRecording}> Start Recording </IonButton>}

        {/* Stop Recording */}
        {isRecording  && <p style={{paddingTop: "16px", textAlign: "center"}}>Click <b>Stop Recording </b>to stop recording.</p>}
        {isRecording  && <IonButton color="danger" expand="block" onClick={this.stopRecording}> Stop Recording </IonButton>}  

        {/* Current Recoring */}

        {!isRecording  &&  this.state.blobURL !== "" &&<p style={{paddingTop: "16px"}}> <b>Your recording 👇</b> </p>}
        {!isRecording  &&  this.state.blobURL !== "" &&
              <>
                <audio
                  ref="audioSource"
                  style={{
                    width : "100%", 
                  }}
                  controls="controls"
                  src={this.state.blobURL || ""}
                />

              </>
              
            }
              
        {/* Check Similarity */} 
        {!isRecording && this.state.blobURL !== "" && <IonButton color="secondary" expand="block"  style={{marginTop : "1rem"}} onClick = {this.sendAudio}> 
          {!this.state.isLoading && <p>Check similarity</p>} 
          {this.state.isLoading &&  <IonSpinner name="bubbles"></IonSpinner>} 
          
        </IonButton>}
        {
          this.state.result !== 0 && (
            <div style={{width: "100%", paddingTop: "16px"}}>
              <p><b>Similarity Percentage %</b></p>             
                <ProgressBar width="300" trackWidth="20" percentage={this.state.result}/>
            </div>)
             
        }

      </React.Fragment>
    );
  }
}

export default AudioRecorder;