import React from "react";
import Button from "material-ui/Button";
import { logout } from "../helpers/auth";
import { firebaseAuth } from "../config/constants";
import FileSaver from "file-saver";

export default function exportAnki() {
    // fetchAnkiDb().then(dataSnapshot => {
    //   var text = "";
    //   for (const [key, value] of Object.entries(dataSnapshot.val())) {
    //     text +=
    //       '<img alt="Embedded Image"src="' +
    //       value.front +
    //       '">	' +
    //       value.back +
    //       "\r\n";
    //   }
    //   var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    //   FileSaver.saveAs(blob, "anki.txt");
    // });
    // TODO
  }
