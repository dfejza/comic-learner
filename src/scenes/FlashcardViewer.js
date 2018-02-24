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
import { fetchAnkiDbWhole, getCards } from "../helpers/auth";
import firebase from "firebase";
import Dialog from 'material-ui/Dialog';
import Button from 'material-ui/Button';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    cardImage: ""
  }
});

class FlashCardViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], open: false };
  }

  createSortHandler = property => event => {
   this.setState({cardImage : property.front, open : true});
 };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    var database = [];
    getCards().then(data => {
      console.log(data);
      this.setState({ data: data });
    })

  }

  render() {
    const { classes } = this.props;
    return (
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
                <TableCell numeric>{Date(n.created_at)}</TableCell>
                <TableCell numeric>{n.num_reviews}</TableCell>
                <TableCell numeric>{n.num_lapses}</TableCell>
                <TableCell numeric>{n.due_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ShowFrontPictureWrapped
          cardimage={this.state.cardImage}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
        />
      </Paper>
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
    this.props.onRequestClose(value);
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, onRequestClose, selectedValue, ...other } = this.props;
    const { value } = this.state;

    return (
      <Dialog onRequestClose={this.props.onRequestClose} {...other}>
        <img src={this.props.cardimage} alt="" />
      </Dialog>
    );
  }
}

ShowFrontPicture.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestClose: PropTypes.func,
  selectedValue: PropTypes.string
};

const ShowFrontPictureWrapped = withStyles(styles)(ShowFrontPicture);
