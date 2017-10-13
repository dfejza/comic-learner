import React from "react";
import {
  login,
  resetPassword,
  auth,
  loginWithFacebook,
  loginWithGoogle
} from "../helpers/auth";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Dialog, { DialogTitle } from "material-ui/Dialog";
import blue from "material-ui/colors/blue";
import Button from "material-ui/Button";
import AccountBoxIcon from "material-ui-icons/AccountBox";
import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";

function setErrorMsgLogin(error) {
  return {
    loginMessage: error
  };
}
function setErrorMsgRegister(error) {
  return {
    registerError: error.message
  };
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30
  },
  avatar: {
    background: blue[100],
    color: blue[600]
  },
  button: {
    margin: theme.spacing.unit,
    width: 160
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 345
  }
});

class LoginDialogue extends React.Component {
  state = { loginMessage: null, registerError: null, email: "", password: "" };
  handleSubmitLogin = e => {
    e.preventDefault();
    login(this.state.email, this.state.password)
      .then(() => {
        if (this.props.authed) {
          this.handleRequestClose();
          this.props.onDrawerClose();
        }
      })
      .catch(error => {
        this.setState(setErrorMsgLogin("Invalid username/password."));
      });
  };
  handleSubmitRegister = e => {
    e.preventDefault();
    auth(this.state.email, this.state.password)
      .then(() => {
        if (this.props.authed) {
          this.handleRequestClose();
          this.props.onDrawerClose();
        }
      })
      .catch(e => this.setState(setErrorMsgRegister(e)));
  };

  handleFacebookLogin = e => {
    e.preventDefault();
    loginWithFacebook()
      .then(() => {
        //if(this.props.authed){
        //  this.handleRequestClose();
        //  this.props.onDrawerClose();
        //}
      })
      .catch(error => {
        this.setState(setErrorMsgLogin("Invalid username/password."));
      });
  };

  handleGoogleLogin = e => {
    e.preventDefault();
    loginWithGoogle()
      .then(() => {
        //if(this.props.authed){
        //  this.handleRequestClose();
        //  this.props.onDrawerClose();
        //}
      })
      .catch(error => {
        this.setState(setErrorMsgLogin("Invalid username/password."));
      });
  };

  resetPassword = () => {
    resetPassword(this.email.value)
      .then(() =>
        this.setState(
          setErrorMsgLogin(`Password reset email sent to ${this.email.value}.`)
        )
      )
      .catch(error =>
        this.setState(setErrorMsgLogin(`Email address not found.`))
      );
  };

  handleRequestClose = () => {
    this.props.onRequestClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onRequestClose(value);
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const { classes, onRequestClose, selectedValue, ...other } = this.props;

    return (
      <Dialog maxWidth="xs" onRequestClose={this.handleRequestClose} {...other}>
        <DialogTitle>Login</DialogTitle>
        <div>
          <Grid container spacing={0}>
            <form className={classes.container} noValidate autoComplete="off">
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  type="email"
                  onChange={this.handleChange("email")}
                  className={classes.textField}
                  inputRef={email => (this.email = email)}
                  placeholder="Email"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  type="password"
                  onChange={this.handleChange("password")}
                  className={classes.textField}
                  inputRef={pw => (this.pw = pw)}
                  placeholder="Password"
                />
              </Grid>

              <Grid item xs={6}>
                <Button
                  className={classes.button}
                  type="submit"
                  disabled
                  value="signup"
                  onClick={this.handleSubmitRegister}
                >
                  Sign Up
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  className={classes.button}
                  type="submit"
                  value="signin"
                  onClick={this.handleSubmitLogin}
                >
                  Sign in
                </Button>
              </Grid>
              <hr />
              <hr />
              <Grid item xs={12}>
                <Button
                  className={classes.button}
                  id="googleSignin"
                  disabled
                  type="submit"
                  onClick={this.handleSubmitLogin}
                >
                  Google
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  className={classes.button}
                  id="facebookSignin"
                  disabled
                  type="submit"
                  onClick={this.handleFacebookLogin}
                >
                  Facebook
                </Button>
              </Grid>
            </form>
            {this.state.loginMessage && (
              <div className="alert alert-danger" role="alert">
                <span
                  className="glyphicon glyphicon-exclamation-sign"
                  aria-hidden="true"
                />
                <span className="sr-only">Error:</span>
                &nbsp;{this.state.loginMessage}{" "}
                <a onClick={this.resetPassword} className="alert-link">
                  Forgot Password?
                </a>
              </div>
            )}
            {this.state.registerError && (
              <div className="alert alert-danger" role="alert">
                <span
                  className="glyphicon glyphicon-exclamation-sign"
                  aria-hidden="true"
                />
                <span className="sr-only">Error:</span>
                &nbsp;{this.state.registerError}
              </div>
            )}
          </Grid>
        </div>
      </Dialog>
    );
  }
}

LoginDialogue.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestClose: PropTypes.func,
  selectedValue: PropTypes.string
};

const LoginDialogueWrapped = withStyles(styles)(LoginDialogue);

class LoginDialogueButton extends React.Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  handleRequestClose = value => {
    this.setState({ selectedValue: value, open: false });
  };

  render() {
    return (
      <div>
        <ListItem button onClick={this.handleClickOpen}>
          <ListItemIcon>
            <AccountBoxIcon />
          </ListItemIcon>
          <ListItemText primary={this.props.text} />
        </ListItem>
        <LoginDialogueWrapped
          authed={this.props.authed}
          onDrawerClose={this.props.onDrawerClose}
          contact={this.props.contact}
          selectedValue={this.state.selectedValue}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}

export default LoginDialogueButton;
