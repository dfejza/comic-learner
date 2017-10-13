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
import ViewHeadlineIcon from "material-ui-icons/ViewHeadline";
import PermMediaIcon from "material-ui-icons/PermMedia";
import ContactMailIcon from "material-ui-icons/ContactMail";
import AccountBoxIcon from "material-ui-icons/AccountBox";
import LoginDialogueButton from "./../components/login";
import Dialog, { DialogTitle } from "material-ui/Dialog";
import Divider from "material-ui/Divider";

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
        <List subheader={<ListSubheader>dfejza</ListSubheader>}>
          <Link to="/">
            <ListItem button>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Manga Library" />
            </ListItem>
          </Link>
          <Divider />
          {!this.props.authed && (
            <LoginDialogueButton
              onDrawerClose={this.toggleDrawer("right", false)}
              authed={this.props.authed}
              text="Login"
            />
          )}
          {this.props.authed && (
            <div>
              <Link to="/dashboard">
                <ListItem button>
                  <ListItemIcon>
                    <AccountBoxIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Account" />
                </ListItem>
              </Link>
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
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer("right", false)}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}

NavigationBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NavigationBar);
