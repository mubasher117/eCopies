const functions = require('firebase-functions');
const fetch = require('node-fetch')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });



//send the push notification 
exports.sendPushNotification = functions.database.ref('contacts/{id}').onCreate(event => {
    var messages = [
      {
        to: "ExponentPushToken[RD0ZPgKNJDJLjVXOAigOdo]",
        sound: "default",
        body: "New Note Added",
      },
    ];
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });
});
