// @flow weak

import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";
import Paper from "material-ui/Paper";
import { fetchAnkiDbWhole, getCards, deleteCards } from "../helpers/auth";
import firebase from "firebase";
import Dialog from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    cardImage: ""
  },
  button: {
    margin: theme.spacing.unit,
    float: "right",
  }
});

class FlashCardViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], open: false, checkCount : 0};
  }

  createSortHandler = property => event => {
    this.setState({cardImage : property.front, open : true});
  };

  handleCheck(key){
    let tempData = this.state.data;
    tempData[key].checked = !tempData[key].checked;
    // Maintain a counter for number checked, for UI element 'DELELTE SELECTED' to appear
    tempData[key].checked ? this.state.checkCount++ : this.state.checkCount--;
    this.setState({ data : tempData });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    var database = [];
    getCards().then(data => {
      console.log(data);
      //create a checkbox component for each data element
      data.forEach((e, i) => {
        e.checked = false;
      });
      this.setState({ data: data });
    })
  }

  // Deleted the selected cards off the database
  // Create a list of keys to delete, consisting of the 
  deleteSelected(){
    let deleteId = [];
    for(var i = 0; i < this.state.data.length; i++){
      if(this.state.data[i].checked){
        deleteId.push(this.state.data[i].created_at);
      }
    }
    deleteCards(deleteId).then( ()=>{
      this.componentDidMount();
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
      <Paper className={classes.paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Manga</TableCell>
              <TableCell numeric>Volume</TableCell>
              <TableCell numeric>Page</TableCell>
              <TableCell numeric>Front</TableCell>
              <TableCell numeric>Back</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell numeric># Reviewed</TableCell>
              <TableCell numeric># Lapses</TableCell>
              <TableCell numeric>Due Date</TableCell>
              <TableCell>Delete?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.data.map((n, key) => (
              <TableRow key={key}>
                <TableCell>{n.manga}</TableCell>
                <TableCell numeric>{n.volume}</TableCell>
                <TableCell numeric>{n.page}</TableCell>
                <TableCell ><Button onClick={this.createSortHandler(n)}>View</Button></TableCell>
                <TableCell numeric>{n.back}</TableCell>
                <TableCell numeric>{n.created_at}</TableCell>
                <TableCell numeric>{n.num_reviews}</TableCell>
                <TableCell numeric>{n.num_lapses}</TableCell>
                <TableCell numeric>{n.due_date}</TableCell>
                <TableCell><Checkbox checked={n.checked} onChange={()=> this.handleCheck(key)} value="" /> </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ShowFrontPictureWrapped
          cardimage={this.state.cardImage}
          open={this.state.open}
          onClose={this.handleRequestClose}
        />
      </Paper>
      {this.state.checkCount > 0 &&
        <Button variant="raised" color="primary" className={classes.button} onClick={()=>this.deleteSelected()}>
          DELETE SELECTED
        </Button>
      }
      </div>
    );
  }
}

FlashCardViewer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FlashCardViewer);


class ShowFrontPicture extends React.Component {
  state = {
    value: 0,
    back: ""
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;
    const { value } = this.state;

    return (
      <Dialog onClose={this.props.onClose} {...other}>
        <img src={this.props.cardimage} alt="" />
      </Dialog>
    );
  }
}

ShowFrontPicture.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string
};

const ShowFrontPictureWrapped = withStyles(styles)(ShowFrontPicture);
