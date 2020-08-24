import { database, getUserId } from "./authenication";
import store from "../../redux/store";
import AsyncStorage from "@react-native-community/async-storage";

export async function getMyOrders() {
  getUserId().then((userId) => {
    let tempMyOrders = [];
    var dbRef = database
      .ref("/orders")
      .orderByChild("customerId")
      .equalTo(userId);
    dbRef.on("value", (snapshot) => {
      let data = snapshot.val();
      if (data) {
        let keys = Object.keys(data);
        for (var key of keys) {
          tempMyOrders.push({
            id: key,
            ...data[key],
          });
        }
      }
      // Getting orders from pending orders
      database
        .ref("/pendingOrders")
        .orderByChild("customerId")
        .equalTo(userId)
        .on("value", (snapshot) => {
          console.log("IN PENDING");
          console.log(snapshot.val());
          let data = snapshot.val();
          if (data) {
            let keys = Object.keys(data);
            for (var key of keys) {
              tempMyOrders.push({
                id: key,
                ...data[key],
              });
              console.log(key);
            }
            console.log("OUT PENDING");
          }
          store.dispatch({
            type: "setMyOrders",
            payload: tempMyOrders,
          });
        });
      console.log("TOTAL LENGTH:  ", tempMyOrders.length);
    });
  });
}

export async function seeNotification(notification) {
  let seenNotification = { ...notification, isSeen: true };
  database.ref("notifications/" + notification.id).set(seenNotification);
}
