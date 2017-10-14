import React, { Component } from "react";
import "./../css/App.css";

import { Route, Switch, Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { firebaseAuth } from "../config/constants";

//Comps
import NavigationBar from "./../components/navbar.js";
import MangaReader from "./../scenes/MangaReader";
import MangaRaderPage from "./../scenes/MangaReaderPage";
import { connect } from "react-redux";
import "./../css/BootstrapOverride.css";
import FlashCardViewer from "./FlashcardViewer"

class App extends Component {
  state = {
    authed: false,
    loading: true
  };

  componentDidMount() {
    this.removeListener = firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authed: true,
          loading: false
        });
      } else {
        this.setState({
          authed: false,
          loading: false
        });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    return (
      <div>
        <NavigationBar authed={this.state.authed} />

        <div className="centered-container">
          <Switch>
            <Route
              exact
              path="/"
              render={() => <MangaReader authed={this.state.authed} store={this.props} />}
            />
            <Route
              path="/mangareader/:manga/:volume/:page"
              render={props => (
                <MangaRaderPage
                  {...props}
                  authed={this.state.authed}
                  mangaData={this.props.data.mangaDb}
                />
              )}
            />;
            <Route
              path="/flashcardviewer"
              render={props => (
                <FlashCardViewer
                  {...props}
                  authed={this.state.authed}
                />
              )}
            />;
          </Switch>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state.data.data
  };
};

export default withRouter(connect(mapStateToProps)(App));
