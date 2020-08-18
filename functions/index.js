const functions = require("firebase-functions");
const fetch = require("node-fetch");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
//send the push notification
exports.sendPushNotification = functions.database
  .ref("contacts/")
  .onCreate((event) => {
    let desitnation;
    var message = {
      to: "ExponentPushToken[RD0ZPgKNJDJLjVXOAigOdo]",
      sound: "default",
      body: "New Note Added",
      title: "Original Title",
      data: { data: "goes here" },
    };
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    // admin.database().ref("userData/").once("value", (snapshot) => {
    //   if (snapshot.val()) {
    //     desitnation = snapshot.val().betHg4Nq4dYmoZxyarOCVhkZkNB3.expoToken;
    //     var message = {
    //       to: desitnation,
    //       sound: "default",
    //       body: "New Note Added",
    //       title: "Original Title",
    //       data: { data: "goes here" },
    //     };
    //     console.log(message)
    //     fetch("https://exp.host/--/api/v2/push/send", {
    //       method: "POST",
    //       headers: {
    //         Accept: "application/json",
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(message),
    //     });
    //   }
    // });
  });
