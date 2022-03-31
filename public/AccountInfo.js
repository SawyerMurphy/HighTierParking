firebase.initializeApp({
    apiKey: "AIzaSyCIp4TEX0_gEB1bliF3RYdpBwXPBl7GBnY",
    authDomain: "hightierparking2.firebaseapp.com",
    projectId: "hightierparking2"
  });
  
  var db = firebase.firestore();

  //var citiesRef = db.collection("user");

    //citiesRef.doc("SF").set({
    //name: "San Francisco", state: "CA", country: "USA",
    //capital: false, population: 860000,
    //regions: ["west_coast", "norcal"] });

    var docRef = db.collection("users").doc("Email", "==", "wasinasary@gmail.com");

    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
  
  db.collection("user").where("Email", "==", "wasinasary@gmail.com")
    .get()
    .then((querySnapshot) => {
        
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
    
    /*
    var firstName;
    var getFirstName=db.collection('user').where("Email", "==", "wasinasary@gmail.com");
    var getDoc=getFirstName.get()
        .then(doc =>{
        firstName=doc.data().FirstName;
    });
    */

  //var getauth = firebase.auth();
  /*
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
  //}
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
  }