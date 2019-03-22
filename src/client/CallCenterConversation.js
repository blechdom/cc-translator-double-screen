import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MultilineOutput from './MultilineOutput';
import Button from '@material-ui/core/Button';
import { startStreaming, stopStreaming, base64ToBuffer, disconnectSource } from './AudioUtils';

  let concatText = '',
    newText = '',
    source = null,
    bufferSize = 2048,
    audioBuffer = null,
    active_source = false,
    processor,
    input,
    globalStream;

class CCConversation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      audio: false,
      socket: this.props.socket
    };
    this.toggleListen = this.toggleListen.bind(this);
    this.playAudioBuffer = this.playAudioBuffer.bind(this);
  }

  componentDidMount() {

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    this.state.socket.on('audiodata', (data) => {
      var audioFromString = base64ToBuffer(data);
      this.stopListening();
      this.playAudioBuffer(audioFromString, this.audioContext, true);

    });
    this.toggleListen();
  }
  componentWillUnmount() {
    this.stopListening();
    this.audioContext.close();
    this.state.socket.off("audiodata");
  }

  async startListening(){
    if(!this.state.audio){
      this.state.socket.emit("startStreaming", true);
      startStreaming(this.audioContext);
      this.setState({audio: true});
      console.log("startListening");
    }
  }
  stopListening(){
    if(this.state.audio){
      this.state.socket.emit("stopStreaming", true);
      this.setState({audio:false});
      stopStreaming(this.audioContext);
      console.log("stopListening");
    }
  }
  toggleListen() {

      if (this.state.audio) {
        this.stopListening();
      } else {
        this.startListening();
      }
    }

  playAudioBuffer(audioFromString, context, continuous){

    if (active_source){
      source.stop(0);
      source.disconnect();
      active_source=false;
    }
    //if(continuous){
    //  stopStreaming(context);
    //}

    context.decodeAudioData(audioFromString, (buffer) => {
        active_source = true;
        audioBuffer = buffer;
        source = context.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = false;
        source.connect(context.destination);
        source.start(0);
        //this.setState({audio:false});
        active_source = true;
        source.onended = (event) => {
          console.log('audio playback stopped');
          if(continuous){
            this.startListening();
          }
        };
    }, function (e) {
        console.log('Error decoding file', e);
    });
  }
  render(){
    return (
      <React.Fragment>
        <Grid container spacing={24}>
          <Grid item xs={12} zeroMinWidth>
            <Button variant="contained" color="primary" onClick={this.toggleListen}>{this.state.audio ? 'Mic Active' : 'Mic Muted'}</Button>
          </Grid>
          <Grid item xs={12} zeroMinWidth>
            <MultilineOutput socket={this.state.socket} speakToo="true" />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default CCConversation;
