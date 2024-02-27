import React from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
export default function SpeechRecognitionComponent() {
  const { transcript, browserSupportsSpeechRecognition , resetTranscript } = useSpeechRecognition();
  const listenToUser = () => {
    
      console.log('listenToUser start');
      if (!browserSupportsSpeechRecognition) {
        console.log("YOUR BROWSER DOES NOT SUPPORT SPEECH RECOGNITION");
        return;
      }

      // setAnimation('listening');
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
      console.log('Listening starts');

      setTimeout(() => {
        SpeechRecognition.stopListening();
        console.log('Listening stops');
        console.log('Spoken Text:', transcript);
        // setSpeechInputText(transcript);
        // setAnimation(null);
      }, 5000);
   
  };
  return (
    <div>
      <button onClick={listenToUser}>Listen to user</button>
    </div>
  )
}
