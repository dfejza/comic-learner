import React from "react";
import { findDOMNode } from "react-dom";
import { Pagination } from "react-bootstrap";
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
    if (nextPage <= this.state.pageCount) {
      this.setState({ page: nextPage }, () => {
        this.nextPage();
      });
    }
  }

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

  setCardImage(iCardImage) {
    this.setState({ cardImage: iCardImage }, () => {
      this.handleClickOpen();
    });
  }

  render() {
    return (
      <div id="textAlignCenter">
        <Pagination
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
        />
        <div>
          <MangaSinglePage
            id="mangaPageDiv"
            manga={this.state.manga}
            volume={this.state.volume}
            page={this.state.page}
            parentClick={this.incrementPage}
            storeCardImage={this.setCardImage.bind(this)}
          />
        </div>
        <CreateCardWrapped
          cardImage={this.state.cardImage}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
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
      cropConfirmDialogue: false
    };
    this.cropAfterLoad = this.cropAfterLoad.bind(this);
  }

  componentDidMount() {}

  changeLoading() {
    this.setState({ imageStatus: "loading" });
    document.getElementById("overlay").style.display = "block";
  }

  handleImageLoaded() {
    this.setState({ imageStatus: "loaded" });
    document.getElementById("overlay").style.display = "none";

    const rect = this.refs.mangaslide.getBoundingClientRect();
    const docEl = document.documentElement;
    const rectTop = rect.top + window.pageYOffset - docEl.clientTop;
    const rectLeft = rect.left + window.pageXOffset - docEl.clientLeft;

    console.log(rect);

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
      x2: e.pageX,
      y2: e.pageY,
      height: e.pageY - this.state.y1,
      width: e.pageX - this.state.x1
    });
  }

  ondragenddone(e) {
    this.setState({
      x2: e.pageX,
      y2: e.pageY,
      height: e.pageY - this.state.y1,
      width: e.pageX - this.state.x1,
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
      this.state.x1 - this.state.imgXOffset,
      this.state.y1 - this.state.imgYOffset,
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
            left: this.state.x1,
            top: this.state.y1
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
          <Button onClick={this.createCrop.bind(this)} color="primary">
            Translate
          </Button>
          <Button onClick={this.createCrop.bind(this)} color="primary">
            Create Card
          </Button>
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
