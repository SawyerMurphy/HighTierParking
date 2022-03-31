//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
//import { getAuth, getAuth,createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js';
//const firebase = require("firebase");

// Required for side-effects


//const { default: firebase } = require("firebase");

//require("firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyCIp4TEX0_gEB1bliF3RYdpBwXPBl7GBnY",
  authDomain: "hightierparking2.firebaseapp.com",
  projectId: "hightierparking2"
});

var db = firebase.firestore();
//var getauth = firebase.auth();

document.getElementById("reg").addEventListener("submit",submitform);
function submitform(e) {
    e.preventDefault();
    
  
    //get values
    var firstName = getInputVal('regFirstNameInput');
    var lastName = getInputVal('regLastNameInput');
    var email = getInputVal('regEmailAddInput');
    var pswd = getInputVal('regPasswordInput');
    
    saveAccount(firstName, lastName, email, pswd);
    
    
    db.collection("user").add({
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Password: pswd
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
    window.location.href = "AccountInfo.htm"

/*

  db.collection("users").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  });
*/  
}
//console(firstName);
function getInputVal(id){
    return document.getElementById(id).value;
}



function saveAccount(firstName,lastName,email,password){
  var newAccountRef = accountRef.push();
    newAccountRef.set({
      firstName:firstName,
      lastName:lastName,
      email:email,
      password:password 
    }); 
    
    sessionStorage.setItem("FirstName", document.getElementById("regFirstNameInput"));
    sessionStorage.setItem("LastName", document.getElementById("regLastNameInput"));
    sessionStorage.setItem("Email", document.getElementById("regEmailAddInput"));
    sessionStorage.setItem("Password", document.getElementById("regPasswordInput"));
} 