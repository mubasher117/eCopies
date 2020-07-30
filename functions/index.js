const functions = require("firebase-functions");
const fetch = require("node-fetch");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.sendPushNotifications = functions.functions.database
  .ref("testForm/{id}")
  .onCreate((event) => {
    const root = event.data.ref.root;
    var messsages = [];

    return root
      .child("/userData")
      .once("value")
      .then(function (snapshot) {
        snapshot.forEach((childSnapshot) => {
          var expoToken = childSnapshot.val().ExpoToken;
          if (expoToken) {
            messsages.push({
              to: expoToken,
              body: "New Form Added",
            });
          }
        });
        return Promise.all(messsages);
      })
      .then((messsages) => {
        let data = "success";
        fetch("https://exp.host/--/api/v2/push/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messages),
        }).catch((error) => {
          data = "error";
        });
        return data;
      });
  });
