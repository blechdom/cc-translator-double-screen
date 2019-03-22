import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ResetIcon from '@material-ui/icons/Autorenew';
import Typography from '@material-ui/core/Typography';
import CallCenterLogin from './CallCenterLogin';
import CallCenterConversation from './CallCenterConversation';
import { socket } from './api';


const styles = theme => ({
  root: {
      flexGrow: 1,
  },
  title: {
    padding: theme.spacing.unit * 2,
     color: 'white',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(720 + theme.spacing.unit * 2 * 2)]: {
      width: 720,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    [theme.breakpoints.up(720 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
    },
    minWidth: 300,
  },
  form: {
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(720 + theme.spacing.unit * 3 * 2)]: {
      padding: theme.spacing.unit * 3,
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
  },
  ResetImg: {
    cursor:'pointer',
    float:'right',
    marginTop: '0px',
    color: 'white',
  },
});



class CloudAIDemos extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentForm: <CallCenterLogin socket={socket}/>
    };
  }
  componentDidMount() {
    socket.on("resetTranslator", (data) => {
      this.setState({
        currentForm: <CallCenterLogin socket={socket}/>
      })
    });
    socket.on("loginToCall", (data) => {
      this.setState({
        currentForm: <CallCenterConversation socket={socket}/>
      });
    });
  }
  componentWillUnmount() {
    socket.off("resetTranslator");
    socket.off("loginToCall");
  }
  startOver(){
    console.log("resetting call");
    socket.emit("resetCall", true);
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <AppBar position="static">
              <Typography component="h1" variant="h4" className={classes.title} align="center">
                Call Center Translator
                  <IconButton aria-label="Agent Login" onClick={this.startOver} disabled={this.state.agentDisabled} className={classes.ResetImg}>
                    <ResetIcon />
                  </IconButton>
              </Typography>
            </AppBar>
            <React.Fragment>
              <div className={classes.form}>
                {this.state.currentForm}
              </div>
            </React.Fragment>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

CloudAIDemos.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CloudAIDemos);
