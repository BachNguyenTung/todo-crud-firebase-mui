import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpaz6bBtAF_RX_aqF-x53f2PrR0I7KBuw",
  authDomain: "todo-4e043.firebaseapp.com",
  projectId: "todo-4e043",
  storageBucket: "todo-4e043.appspot.com",
  messagingSenderId: "45525708802",
  appId: "1:45525708802:web:7b990c8fe578d0fcdab71b",
};

//create firebase app instance
const firebaseApp = firebase.initializeApp(firebaseConfig);
//create db
const db = firebaseApp.firestore();
const storage = firebaseApp.storage();

export { db, storage };
