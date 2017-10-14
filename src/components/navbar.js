// import { FormControl, option } from "react-bootstrap"
// import { LinkContainer } from 'react-router-bootstrap'
import { Link } from "react-router-dom";
// import { IndexLinkContainer } from 'react-router-bootstrap'
import React from "react";
// Material components
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Drawer from "material-ui/Drawer";
import Button from "material-ui/Button";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import ListSubheader from "material-ui/List/ListSubheader";
import HomeIcon from "material-ui-icons/Home";
import CloudCirleIcon from "material-ui-icons/CloudCircle";
import FileDownloadIcon from "material-ui-icons/FileDownload";
import ViewHeadlineIcon from "material-ui-icons/ViewHeadline";
import PermMediaIcon from "material-ui-icons/PermMedia";
import ContactMailIcon from "material-ui-icons/ContactMail";
import AccountBoxIcon from "material-ui-icons/AccountBox";
import LoginDialogueButton from "./../components/login";
import Dialog, { DialogTitle } from "material-ui/Dialog";
import Divider from "material-ui/Divider";
import { logout, fetchAnkiDb } from "../helpers/auth";
import ExportDialogueButton from "./ExportDialogue";

const styles = {
  list: {
    width: 250,
    flex: "initial"
  },
  listFull: {
    width: "auto",
    flex: "initial"
  },
  small: {
    width: 72,
    height: 72,
    padding: 8
  }
};

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "eng",
      open: true,
      openLang: false,
      right: false
    };
  }

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  handleLogout(){
    logout();
  }

  handleClickOpenLang = () => {
    this.setState({
      openLang: true
    });
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };

  render() {
    const sideList = (
      <div>
        <List subheader={<ListSubheader>Manga Learner</ListSubheader>}>
          <Link to="/">
            <ListItem button>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Manga Library" />
            </ListItem>
          </Link>
          <br /><Divider /><br />
          {!this.props.authed && (
            <LoginDialogueButton
              onDrawerClose={this.toggleDrawer("right", false).bind(this)}
              authed={this.props.authed}
              text="Login"
            />
          )}
          {this.props.authed && (
            <div>
              <Link to="/flashcardviewer">
                <ListItem button onClick={this.handleExportAnki} >
                  <ListItemIcon>
                    <CloudCirleIcon />
                  </ListItemIcon>
                  <ListItemText primary="View Saved Flashcards" />
                </ListItem>
              </Link>
              <ExportDialogueButton />
              <ListItem button onClick={this.handleLogout}>
                <ListItemIcon>
                  <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </div>
          )}
        </List>
      </div>
    );

    return (
      <div>
        <Button
          style={{ position: "fixed", top: 0, right: 0 }}
          onClick={this.toggleDrawer("right", true)}
        >
          <ViewHeadlineIcon className="App-logo" style={styles.small} />
        </Button>
        <Drawer
          anchor="right"
          open={this.state.right}
          width={300}
          onRequestClose={this.toggleDrawer("right", false)}
        >
            {sideList}
        </Drawer>
      </div>
    );
  }
}

NavigationBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NavigationBar);
