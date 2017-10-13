import React, { Component } from "react";
import "./../css/App.css";

import { Route, Switch, Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { firebaseAuth } from "../config/constants";

//Comps
import NavigationBar from "./../components/navbar.js";
import MangaReader from "./../scenes/MangaReader";
import MangaRaderPage from "./../scenes/MangaReaderPage";
import Dashboard from "./../scenes/Dashboard";
import { connect } from "react-redux";
import "./../css/BootstrapOverride.css";

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
              render={() => <MangaReader store={this.props} />}
            />
            <Route
              path="/mangareader/:manga/:volume/:page"
              render={props => (
                <MangaRaderPage
                  {...props}
                  mangaData={this.props.data.mangaDb}
                />
              )}
            />;
            <Route
              path="/dashboard"
              render={() =>
                this.state.authed === true ? (
                  <Dashboard />
                ) : (
                  <Redirect
                    to={{ pathname: "/", state: { from: this.props.location } }}
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
