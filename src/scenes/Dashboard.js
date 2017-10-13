import React from "react";
import Button from "material-ui/Button";
import { logout, fetchAnkiDb } from "../helpers/auth";
import { firebaseAuth } from "../config/constants";
import FileSaver from "file-saver";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  logOut = () => {
    logout();
  };

  exportAnki() {
    fetchAnkiDb().then(dataSnapshot => {
      var text = "";
      for (const [key, value] of Object.entries(dataSnapshot.val())) {
        text +=
          '<img alt="Embedded Image"src="' +
          value.front +
          '">	' +
          value.back +
          "\r\n";
      }
      var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, "anki.txt");
    });
  }

  render() {
    return (
      <div>
        <h2>
          Welcome to your own personal space {firebaseAuth().currentUser.email}
        </h2>
        <h2>Work in progress</h2>
        <br />
        <br />
        <Button raised component="span" onClick={this.exportAnki}>
          Export flashcards to Anki
        </Button>
        <br />
        <br />
        <Button onClick={this.logOut}>Log Out</Button>
      </div>
    );
  }
}
