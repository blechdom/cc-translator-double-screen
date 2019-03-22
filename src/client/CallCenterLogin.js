import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import LanguageSelects from './LanguageSelects';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import HeadsetIcon from '@material-ui/icons/HeadsetMicTwoTone';
import PersonIcon from '@material-ui/icons/PersonOutlineTwoTone';

class CallCenterLogin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      socket: this.props.socket,
      agentDisabled: false,
      clientDisabled: false,
    };
    this.agentLogin = this.agentLogin.bind(this);
    this.clientLogin = this.clientLogin.bind(this);
  }

  componentDidMount() {
    this.state.socket.emit("getAvailableRoles", true);

    this.state.socket.on("availableRoles", (roles) => {
      this.setState({
        agentDisabled:false,
        clientDisabled:false
      })
      console.log("in available roles");
      for(var i in roles){
        console.log("roles: " + roles[i]);
        if (roles[i]=="agent"){
          this.setState({agentDisabled:true});
        }
        else if(roles[i]=="client"){
          this.setState({clientDisabled:true});
        }
      }
    });
    this.state.socket.on("resetLogin", (data) => {
      this.state.socket.emit("resetMyData", true);
    });
  }
  componentWillUnmount() {
    this.state.socket.off("resetLogin");
    this.state.socket.off("availableRoles");
  }

  agentLogin() {
    console.log("logging in as agent");
    this.state.socket.emit("joinCall", "agent");
  }
  clientLogin() {
    console.log("logging in as client");
    this.state.socket.emit("joinCall", "client");
  }
  render(){
    return (
      <React.Fragment>
      <Grid container direction="row"
        justify="center"
        alignItems="center"
        spacing={32}>
          <Grid item xs={12}>
        <Typography variant="h4" component="h3" spacing={32}>
          JOIN THE CALL
        </Typography>
          </Grid>
          <Grid item xs={12}>
            <LanguageSelects socket={this.state.socket} speechModel="true"/>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5">Login as...</Typography>
          </Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={3}>
          <div>
            <IconButton aria-label="Agent Login" onClick={this.agentLogin} disabled={this.state.agentDisabled} color='primary'>
              <HeadsetIcon style={{ fontSize: 70 }}/>
            </IconButton>
            <Typography variant="h6" color='primary'>AGENT</Typography>
          </div>
            </Grid>
            <Grid item xs={3}>
          <div>
            <IconButton aria-label="Client Login" label='client' onClick={this.clientLogin} disabled={this.state.clientDisabled} color='secondary'>
              <PersonIcon style={{ fontSize: 70 }}/>
            </IconButton>
            <Typography variant="h6" color='secondary'>CLIENT</Typography>
          </div>
          </Grid>
            <Grid item xs={3}></Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default CallCenterLogin;
