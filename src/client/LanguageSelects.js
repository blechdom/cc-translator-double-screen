import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import { getVoiceList } from './api';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 260,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class LanguageSelects extends React.Component {

  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      socket: this.props.socket,
      labelWidth: 0,
      languageCode: 'en-US',
      voices: [],
      voiceSynth: '',
      voiceSynthOptions: '',
      voiceType: '',
      voiceTypes: [],
      voiceTypeOptions: '',
    };
  }

  componentDidMount() {
    this._isMounted = true;


    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
    });

    getVoiceList((err, voicelist) => {
      if(this._isMounted){
        this.setState({ voices: voicelist }, () => this.populateVoiceSynthSelect());
      }
    });
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  handleLanguageChange = (event) => {
    console.log("handle Language change " + event.target.value);
    this.setState({languageCode: event.target.value }, () => this.populateVoiceSynthSelect());
  };
  handleSynthChange = (event) => {
    console.log("handle synth change " + event.target.value);
    this.setState({ voiceSynth: event.target.value}, () => this.populateVoiceTypeSelect());
  };
  handleVoiceChange = (event) => {
    console.log("handle voice change " + event.target.value);
    this.setState({ voiceType: event.target.value }, () => this.emitVoiceCode());
  };

  emitVoiceCode(){
    let voiceType = this.state.voiceType;
    console.log("emitting voice code " + voiceType);

    this.state.socket.emit("voiceCode", voiceType);
  }

  populateVoiceSynthSelect(){
    let languageCode = this.state.languageCode;
    console.log("populate synth with language code " + languageCode);
    let voiceObjects = [];
    let voicelist = this.state.voices;
    voiceObjects = voicelist.find(x => x.languageCode === languageCode).languageTypes;

    let voiceSynthOptionItems = voiceObjects.map((voiceSynth) =>
      <option key={voiceSynth.voiceSynth} value={voiceSynth.voiceSynth}>{voiceSynth.voiceSynth}</option>
    );
    this.setState({voiceTypes: voiceObjects});
    this.setState({voiceSynthOptions: voiceSynthOptionItems});
    if(voiceSynthOptionItems.length>1){
      this.setState({voiceSynth: voiceSynthOptionItems[1].key}, () => this.populateVoiceTypeSelect());
    }
    else {
      this.setState({voiceSynth: voiceSynthOptionItems[0].key}, () => this.populateVoiceTypeSelect());
    }
  }
  populateVoiceTypeSelect(){
    let voiceSynth = this.state.voiceSynth;
    let voiceObjects, voiceTypeOptionItems = [];
    let voicelist = this.state.voiceTypes;
    voiceObjects = voicelist.find(x => x.voiceSynth === voiceSynth).voiceTypes;

    voiceTypeOptionItems = voiceObjects.map((voiceType) =>
      <option key={voiceType.voiceCode} value={voiceType.voiceCode}>{voiceType.voiceName}</option>
    );

    this.setState({voiceTypeOptions: voiceTypeOptionItems});
    if((this.state.languageCode=='en-US') && (voiceSynth=='Wavenet')){
      this.setState({voiceType: "en-US-Wavenet-D"});
      let event = { target: { value: 'en-US-Wavenet-D'}};
        this.handleVoiceChange(event);
    }
    else{
      this.setState({voiceType: voiceTypeOptionItems[0].key});
      let event = { target: { value: voiceTypeOptionItems[0].key}};
        this.handleVoiceChange(event);
    }
  }

  render() {
    const { classes } = this.props;
    let voices = this.state.voices;
    let optionItems = voices.map((voice) =>
      <option key={voice.languageCode} value={voice.languageCode}>{voice.languageName}</option>
    );

    return (
      <div className={classes.root}>
          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel ref={ref => {
                this.InputLabelRef = ref;
              }} htmlFor="language-select">Select Your Language</InputLabel>
              <Select
                native
                value={this.state.languageCode}
                onChange={this.handleLanguageChange}
                inputProps={{
                  name: 'language_select',
                  id: 'language-select',
                }}
              >
               {optionItems}
             </Select>
            </FormControl>
          </Grid>
            <Grid item xs={12}>
              <FormControl className={classes.formControl}>
                <InputLabel ref={ref => {
                  this.InputLabelRef = ref;
                }} htmlFor="synth-select">Select Their Voice Synthesis</InputLabel>
                <Select
                  native
                  value={this.state.voiceSynth}
                  onChange={this.handleSynthChange}
                  inputProps={{
                    name: 'synth_select',
                    id: 'synth-select',
                  }}
                >
                 {this.state.voiceSynthOptions}
               </Select>
              </FormControl>
            </Grid>
          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel ref={ref => {
                this.InputLabelRef = ref;
              }} htmlFor="voice-select">Select Their Voice Type</InputLabel>
              <Select
                native
                value={this.state.voiceType}
                onChange={this.handleVoiceChange}
                inputProps={{
                  name: 'voice_select',
                  id: 'voice-select',
                }}
              >
               {this.state.voiceTypeOptions}
             </Select>
            </FormControl>
          </Grid>
      </div>
    );
  }
}

LanguageSelects.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LanguageSelects);
