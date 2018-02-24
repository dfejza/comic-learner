import { ref, firebaseAuth } from "../config/constants";
import firebase from "firebase";
import {saveCardToDB, getCardsFromDB} from './flashcardsApi'

export function auth(email, pw) {
  return firebaseAuth()
    .createUserWithEmailAndPassword(email, pw)
    .then(saveUser);
}

export function logout() {
  return firebaseAuth().signOut();
}

export function login(email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw);
}

export function loginWithFacebook() {
  // Sign in using a popup.
  var provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope("user_birthday");
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      // This gives you a Facebook Access Token.
      //var token = result.credential.accessToken;
      // The signed-in user info.
      //var user = result.user;
    });
}

export function loginWithGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      // This gives you a Google Access Token.
      //var token = result.credential.accessToken;
      // The signed-in user info.
      //var user = result.user;
    });
}

export function resetPassword(email) {
  return firebaseAuth().sendPasswordResetEmail(email);
}

export function saveUser(user) {
  return ref
    .child(`users/${user.uid}/info`)
    .set({
      email: user.email,
      uid: user.uid
    })
    .then(() => user);
}

export function saveCard(card) {
  firebaseAuth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
    // Send token to your backend and cardinfo to backend
    saveCardToDB({idToken, card});

  }).catch(function(error) {
    console.log(error);
    // TODO Handle error
  });
}

export function getCards(){
  return new Promise(function(resolve,reject){
    firebase.auth().onAuthStateChanged(function(user) {
      user.getIdToken(/* forceRefresh */ true).then((idToken) => {
        // Send token to your backend and cardinfo to backend
        resolve(getCardsFromDB(idToken));
      }).catch(function(error) {
        console.log(error);
        // TODO Handle error
      });
    });
  });
};

export function fetchAnkiDb() {
  var user = firebaseAuth().currentUser;
  return firebase
    .database()
    .ref(`users/${user.uid}/anki`)
    .once("value");
}

export function fetchAnkiDbWhole() {
  firebase.auth().onAuthStateChanged( user => {
    firebase
      .database()
      .ref(`users/${user.uid}/anki`)
      .once("value")
      .then( data => {
        var database = [];
        for (const [key, value] of Object.entries(data.val())) {
          database.push(value);
        }
          console.log(database);
        return database;
      })
  });
}
