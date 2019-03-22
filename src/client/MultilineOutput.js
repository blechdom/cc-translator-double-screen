import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import HeadsetIcon from '@material-ui/icons/HeadsetMicTwoTone';
import PersonIcon from '@material-ui/icons/PersonOutlineTwoTone';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  pendingText: {
    color: '#b7e1cd',
    display:"block",

  },
  finalText: {
    color: '#809d8f',
    display:"block",

  },
  translatedText: {
    color: '#ee918d',
    display:"block",
  },

});

class MultilineOutput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      multiline: 'Controlled',
      outputText: '',
      newText: '',
      newTranslation: '',
      concatText: '',
      isFinal: false,
      username: '',
    };
  }

  componentDidMount() {
    const { classes } = this.props;
    let socket = this.props.socket;

      socket.on('getTranscript', (response) => {
        this.setState({newText: response.transcript});
        if (this.state.newText != undefined){
          this.setState({outputText: <div>{this.state.concatText} <div className={classes.pendingText}>{this.state.newText}</div></div>});
          if (response.isfinal){
            this.setState({
              isFinal: true,
              concatText:<div className={classes.finalText}>{this.state.concatText} {this.state.newText}</div>,
            }, () => {
              this.setState({outputText: <div className={classes.finalText}>{this.state.concatText}</div>});
            });
          }
        }
      });
      socket.on('getTranslation', (response) => {
        this.setState({
          concatText: <div>{this.state.concatText} <div className={classes.translatedText}>{response}</div></div>,
          outputText: <div>{this.state.concatText} <div className={classes.translatedText}>{response}</div></div>
        });
        this.setState({newTranslation: ''});
        this.setState({newText: ''});
        this.setState({isFinal: false});
      });

  }

  componentWillUnmount(){
    let socket = this.props.socket;
    socket.off("getTranscript");
    socket.off("getTranslation");
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
      <Typography component="h1" variant="h5">
      {this.state.outputText}
      </Typography>
      </div>
    );
  }
}

MultilineOutput.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MultilineOutput);
