import React from "react";

import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Dialog, {
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText
} from "material-ui/Dialog";
import blue from "material-ui/colors/blue";
import Button from "material-ui/Button";
import AccountBoxIcon from "material-ui-icons/AccountBox";
import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import FileDownloadIcon from "material-ui-icons/FileDownload";
import exportAnki from "./ExportToAnki";

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

class ExportDialogue extends React.Component {
  handleRequestClose = () => {
    this.props.onRequestClose();
  };

  handleListItemClick = value => {
    this.props.onRequestClose();
  };

  hangleGenerateAnkiFile() {
    exportAnki();
  }

  render() {
    const { classes, onRequestClose, selectedValue, ...other } = this.props;

    return (
      <Dialog maxWidth="xs" onClose={this.handleRequestClose} {...other}>
        <DialogTitle>Export to anki</DialogTitle>
        <DialogContent>
              This will generate a tab separated file in which you can import
              with Anki. The images are imbedded in the text file.
            <hr />
            <ul>
              <li>Download the CVS file</li>
              <li>Import it with Anki (File -> Import)</li>
              <li>Fields separated by: Tabs</li>
              <li>Check "Allow HTML in fields"</li>
              <li>Field 1 - Image (Question, Front)</li>
              <li>Field 2 - Typed input (Answer, Back)</li>
            </ul>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.hangleGenerateAnkiFile}>
            Generate Anki File
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ExportDialogue.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestClose: PropTypes.func,
  selectedValue: PropTypes.string
};

const ExportDialogueWrapped = withStyles(styles)(ExportDialogue);

class ExportDialogueButton extends React.Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  handleRequestClose = value => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <ListItem button onClick={this.handleClickOpen}>
          <ListItemIcon>
            <FileDownloadIcon />
          </ListItemIcon>
          <ListItemText primary="Export to Anki" />
        </ListItem>
        <ExportDialogueWrapped
          authed={this.props.authed}
          contact={this.props.contact}
          selectedValue={this.state.selectedValue}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}

export default ExportDialogueButton;
