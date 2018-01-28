import React from "react";
import { findDOMNode } from "react-dom";
//import { Pagination } from "react-bootstrap";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import CreateCardWrapped from "./../components/CreateCard";

export default class MangaReaderPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      manga: this.props.match.params.manga,
      volume: this.props.match.params.volume,
      page: this.props.match.params.page,
      pageCount: 100,
      volumeCount: 1,
      open: false,
      cardImage: null
    };
    this.incrementPage = this.incrementPage.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }

  componentDidMount() {
    this.props.mangaData.forEach(value => {
      // Search the dictionary for the correct entry
      if (value.name === this.state.manga) {
        this.setState({
          pageCount: value.volumePageCountList[value.volumeCount - 1]
        });
        this.setState({ volumeCount: value.volumeCount });
      }
    });
  }

  getInitialState() {
    return {
      activePage: this.state.page
    };
  }

  handleSelect(eventKey) {
    this.setState(
      {
        page: eventKey
      },
      () => {
        this.nextPage();
      }
    );
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  handleRequestClose = value => {
    this.setState({
      open: false
    });
  };

  incrementPage() {
    var nextPage = parseInt(this.state.page, 10) + 1;
    // Following function is used to show meaningful data on the URL
    if (nextPage <= this.state.pageCount) {
      this.setState({ page: nextPage }, () => {
        this.nextPage();
      });
    }
  }

  // Update the URL on the client side
  nextPage() {
    this.props.history.push(
      "/mangareader/" +
        this.state.manga +
        "/" +
        this.state.volume +
        "/" +
        this.state.page
    );
  }

  // When the user "crops" an image, the serial image data is stored on the state of the base component (this).
  // Then the popup to guide the user on making the flash card is appeard through handleClickOpen() function.
  // The popup will grab the image stored on the state.
  setCardImage(iCardImage) {
    this.setState({ cardImage: iCardImage }, () => {
      this.handleClickOpen();
    });
  }

  render() {
    return (
      <div id="textAlignCenter">
        {/* <Pagination
          id="mangaPageDiv"
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          items={this.state.pageCount}
          maxButtons={7}
          activePage={parseInt(this.state.page, 10)}
          onSelect={this.handleSelect}
        /> */}
        <div>
          <MangaSinglePage
            id="mangaPageDiv"
            manga={this.state.manga}
            volume={this.state.volume}
            page={this.state.page}
            parentClick={this.incrementPage} // The parent (this) controls the page. The child (MangaSinglePage) needs to tell the parent when the user request the next page
            authed={this.props.authed}
            storeCardImage={this.setCardImage.bind(this)} // Cropped image
          />
        </div>
        <CreateCardWrapped
        // The popup used to finalize the flashcard creation. Only viewable on the "open" prop, which is enabled after a cropping
          cardImage={this.state.cardImage}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
          manga={this.state.manga}
          volume={this.state.volume}
          page={this.state.page}
        />
      </div>
    );
  }
}

class MangaSinglePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageStatus: "loading",
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      imgXOffset: 0,
      imgYOffset: 0,
      width: 0,
      height: 0,
      cropping: false,
      cropConfirmDialogue: false,
      invertedX: false,
      invertedY: false
    };
    this.cropAfterLoad = this.cropAfterLoad.bind(this);
  }

  componentDidMount() {}

  // A full page loading decal
  changeLoading() {
    this.setState({ imageStatus: "loading" });
    document.getElementById("overlay").style.display = "block";
  }

  handleImageLoaded() {
    this.setState({ imageStatus: "loaded" });
    document.getElementById("overlay").style.display = "none";

    // Get abosolute coordinates, so we can properly crop images
    const rect = this.refs.mangaslide.getBoundingClientRect();
    const docEl = document.documentElement;
    const rectTop = rect.top + window.pageYOffset - docEl.clientTop;
    const rectLeft = rect.left + window.pageXOffset - docEl.clientLeft;

    this.setState({
      imgXOffset: rectLeft,
      imgYOffset: rectTop,
      anchorEl: findDOMNode(this.crop)
    });
  }

  handleImageErrored() {
    this.setState({ imageStatus: "failed to load" });
  }

  ondragstart(e) {
    this.setState({
      x1: e.pageX,
      y1: e.pageY,
      cropping: true
    });
    document.getElementById("imageCropping").style.display = "block";
  }

  onclick(e) {
    if (this.state.cropping) {
      if (
        e.pageX < this.state.x1 ||
        e.pageX > this.state.x2 ||
        (e.pageY < this.state.y1 || e.pageY > this.state.y2)
      ) {
        this.setState({
          cropping: false,
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 0,
          width: 0,
          height: 0,
          cropConfirmDialogue: false
        });
        document.getElementById("imageCropping").style.display = "none";
        document.getElementById("cropConfirmation").style.display = "none";
      }
    } else {
      this.changeLoading();
      this.props.parentClick();
    }
  }

  cancelCrop() {
    this.setState({
      cropping: false,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      width: 0,
      height: 0,
      cropConfirmDialogue: false
    });
    document.getElementById("imageCropping").style.display = "none";
    document.getElementById("cropConfirmation").style.display = "none";
  }

  ondragend(e) {
    e.preventDefault();
    this.setState({
      invertedX: e.pageX < this.state.x1 ? true : false, //check if the user drags left, inverted
      width:
        e.pageX < this.state.x1
          ? this.state.x1 - e.pageX
          : e.pageX - this.state.x1,
      x2: e.pageX,
      y2: e.pageY,
      invertedY: e.pageY < this.state.y1 ? true : false,
      height:
        e.pageY < this.state.y1
          ? this.state.y1 - e.pageY
          : e.pageY - this.state.y1
    });
  }

  ondragenddone(e) {
    this.ondragend(e);
    this.setState({
      cropConfirmDialogue: true
    });
    document.getElementById("cropConfirmation").style.display = "block";
  }

  createCrop() {
    var image = new Image();
    image.src = require("./../assets/manga/" +
      this.props.manga +
      "/volume" +
      this.props.volume +
      "/y (" +
      this.props.page +
      ").jpg");
    this.cropAfterLoad(image);
  }

  cropAfterLoad(loadedImg) {
    var canvas = document.createElement("canvas");
    canvas.width = this.state.width;
    canvas.height = this.state.height;
    var ctx = canvas.getContext("2d");
    ctx.width = this.state.width;
    ctx.height = this.state.height;

    ctx.drawImage(
      loadedImg,
      (this.state.invertedX
        ? this.state.x1 - this.state.width
        : this.state.x1) - this.state.imgXOffset,
      (this.state.invertedY
        ? this.state.y1 - this.state.height
        : this.state.y1) - this.state.imgYOffset,
      this.state.width,
      this.state.height,
      0,
      0,
      this.state.width,
      this.state.height
    );
    this.props.storeCardImage(canvas.toDataURL("image/jpeg"));
    this.cancelCrop();
  }

  render() {
    return (
      <div>
        <div id="overlay">
          <div id="text">Loading</div>
        </div>
        <div
          id="imageCropping"
          style={{
            height: this.state.height,
            width: this.state.width,
            left: this.state.invertedX
              ? this.state.x1 - this.state.width
              : this.state.x1,
            top: this.state.invertedY
              ? this.state.y1 - this.state.height
              : this.state.y1
          }}
          ref={node => {
            this.crop = node;
          }}
        >
          {" "}
        </div>
        <div
          id="cropConfirmation"
          style={{
            left: this.state.x2 - 100,
            top: this.state.y2
          }}
        >
          <Button disabled onClick={this.createCrop.bind(this)} color="primary">
            Translate comming soon
          </Button>

          {this.props.authed ?
            <Button onClick={this.createCrop.bind(this)} color="primary">
              Create Card
            </Button>
            :
            <Button disabled onClick={this.createCrop.bind(this)} color="primary">
              Login to Create Cards
            </Button>
          }

          <Button onClick={this.cancelCrop.bind(this)} color="accent">
            Cancel
          </Button>
        </div>

        <img
          id={this.state.imageStatus}
          alt=""
          ref="mangaslide"
          onDragStart={this.ondragstart.bind(this)}
          onDrag={this.ondragend.bind(this)}
          onDragEnd={this.ondragenddone.bind(this)}
          onLoad={this.handleImageLoaded.bind(this)}
          onError={this.handleImageErrored.bind(this)}
          onClick={this.onclick.bind(this)}
          src={require("./../assets/manga/" +
            this.props.manga +
            "/volume" +
            this.props.volume +
            "/y (" +
            this.props.page +
            ").jpg")}
        />
      </div>
    );
  }
}
