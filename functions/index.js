import firebase from 'firebase';
import { initializeApp } from "firebase/compat/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,createUserWithEmailAndPassword, connectAuthEmulator } from "firebase/compat/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

//const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const firebaseConfig = {
    apiKey: "AIzaSyCIp4TEX0_gEB1bliF3RYdpBwXPBl7GBnY",
    authDomain: "hightierparking2.firebaseapp.com",
    databaseURL: "https://hightierparking2-default-rtdb.firebaseio.com",
    projectId: "hightierparking2",
    storageBucket: "hightierparking2.appspot.com",
    messagingSenderId: "302319328733",
    appId: "1:302319328733:web:427140dc9c7a50fa77ea34",
    measurementId: "G-DKKY5VYY73"
};
  
  // Initialize Firebase
const firebaseApp=initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
//const auth = getAuth(app);
//connectAuthEmulator(auth, "https://localost:9099");
//const db=getFirestore(app);
//const todosCol=collection(db, 'todos');
//const snapshot = await getDocs('todosCol');
const auth=firebase.auth(firebaseApp);
