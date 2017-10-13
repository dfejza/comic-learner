import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyACXbI8PIGtU6DUR6BMOtEQNu89z00CnIQ",
    authDomain: "website-7c6ec.firebaseapp.com",
    databaseURL: "https://website-7c6ec.firebaseio.com",
    projectId: "website-7c6ec",
    storageBucket: "website-7c6ec.appspot.com",
    messagingSenderId: "441665248510"
}

firebase.initializeApp(config)

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth