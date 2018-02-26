import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Paper from "material-ui/Paper";
import Grid from "material-ui/Grid";
import Card, { CardMedia } from "material-ui/Card";
import Typography from "material-ui/Typography";

import { Link } from "react-router-dom";

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 8,
    marginTop: theme.spacing.unit * 3,
  }),
  header: {
    margin: "0 10% 0 10%"
  },

  card: {
    //maxWidth: 345,
    margin: "20px",
    padding: "5px"
  },
  media: {
    width: "400px",
    height: "600px"
  },
  mangaSelection:{
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center"

  }
});

class MangaReader extends React.Component {
  constructor(props) {
    super(props);
    this.openManga = this.openManga.bind(this);
  }
  openManga(mangaName) {}
  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.root}>
      <div className={classes.header}>
        <Typography type="display3" gutterBottom>
          Manga Selection
        </Typography>
        <Typography type="subheading" gutterBottom>
          Select from the following manga below.<br /> Simply click on the image to navigate to the next page.<br /> Click and drag the mouse to crop a specified portion of the image and make a flash card out of it (must be logged in for this feature).<br /> Built in character recognition and translation via OCR coming soon. <hr />
        </Typography>
      </div>
          <div className={classes.mangaSelection}>
            {this.props.store.data.mangaDb.map((manga, index) => (
                <Link
                  to={{
                    pathname: "/mangareader/" + manga.name + "/1/1",
                    state: { mangaPage: manga.name }
                  }}
                  replace
                >
                  <Card className={classes.card}>
                    <img
                      className={classes.media}
                      src={require("./../assets/manga/" +
                        manga.name +
                        "/" +
                        manga.name +
                        ".jpg")}
                    />
                  </Card>
                </Link>
            ))}
        </div>
      </div>
    );
  }
}

MangaReader.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MangaReader);
