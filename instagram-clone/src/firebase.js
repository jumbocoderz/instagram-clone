import firebase from "firebase";


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCsGLM2BCwLkB27zcSC2Qz-gTZ29srp_VM",
    authDomain: "instagram-clone-1da8e.firebaseapp.com",
    databaseURL: "https://instagram-clone-1da8e-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-1da8e",
    storageBucket: "instagram-clone-1da8e.appspot.com",
    messagingSenderId: "441627541573",
    appId: "1:441627541573:web:5acdcf458cf2745f88e32c",
    measurementId: "G-1T1KS0LREW"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};