import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import Dialog, { DialogActions, DialogTitle } from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import blue from "material-ui/colors/blue";
import AppBar from "material-ui/AppBar";
import Tabs, { Tab } from "material-ui/Tabs";
import { saveCard } from "./../helpers/auth";

function TabContainer(props) {
  return <div style={{ padding: 20 }}>{props.children}</div>;
}

const styles = {
  avatar: {
    background: blue[100],
    color: blue[600]
  }
};

class CreateCard extends React.Component {
  state = {
    value: 0,
    back: ""
  };

  saveCardToDb() {
    saveCard({front: this.props.cardImage,
      back: this.state.back,
      manga : this.props.manga,
      volume : this.props.volume,
      page : this.props.page });
    this.props.onRequestClose();
  }

  handleChangeBack(e) {
    this.setState({ back: e.target.value });
  }

  handleListItemClick = value => {
    this.props.onRequestClose(value);
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, onRequestClose, selectedValue, ...other } = this.props;
    const { value } = this.state;

    return (
      <Dialog {...other}>
        <DialogTitle>Card Editor</DialogTitle>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Front (Question)" />
            <Tab label="Back (Answer)" />
          </Tabs>
        </AppBar>
        {value === 0 && (
          <TabContainer>
            <img src={this.props.cardImage} alt="" />
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer>
            <TextField
              autoFocus
              multiline
              rowsMax="4"
              id="Answer"
              label="Answer"
              type="email"
              value={this.state.back}
              onChange={this.handleChangeBack.bind(this)}
              fullWidth
            />
          </TabContainer>
        )}
        <hr />
        <DialogActions>
          <Button onClick={this.props.onRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.saveCardToDb.bind(this)} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

CreateCard.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestClose: PropTypes.func,
  selectedValue: PropTypes.string
};

const CreateCardWrapped = withStyles(styles)(CreateCard);
export default CreateCardWrapped;
