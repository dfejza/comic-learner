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
    width: "100%"
  }),
  card: {
    maxWidth: 420
  },
  media: {
    height: 600
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
        <Grid
          container
          className={classes.root}
          justify="center"
          align="stretch"
        >
          <Grid item xs={12} sm={11} md={10} lg={9}>
            <Typography type="display3" gutterBottom>
              Manga Selection
            </Typography>
            <Typography type="Subheading" gutterBottom>
              Select from the following manga below.<br /> Simply click on the image to navigate to the next page.<br /> Click and drag the mouse to crop a specified portion of the image and make a flash card out of it (must be logged in for this feature).<br /> Built in character recognition and translation via OCR coming soon. <hr />
            </Typography>
            <Grid container justify="center" align="stretch">
              {this.props.store.data.mangaDb.map((manga, index) => (
                <Grid item xs={6} sm={4} key={index}>
                  <Link
                    to={{
                      pathname: "/mangareader/" + manga.name + "/1/1",
                      state: { mangaPage: manga.name }
                    }}
                    replace
                  >
                    <Card className={classes.card}>
                      <CardMedia
                        className={classes.media}
                        image={require("./../assets/manga/" +
                          manga.name +
                          "/" +
                          manga.name +
                          ".jpg")}
                        title="Contemplative Reptile"
                      />
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

MangaReader.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MangaReader);
