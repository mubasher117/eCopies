import { database, getUserId } from "./authenication";
import store from "../../redux/store";
import AsyncStorage from "@react-native-community/async-storage";

export async function getMyOrders() {
  getUserId().then((userId) => {
    var dbRef = database
      .ref("/orders")
      .orderByChild("customerId")
      .equalTo(userId);
    dbRef.on("value", (snapshot) => {
      let data = snapshot.val();
      if (data) {
        let keys = Object.keys(data);
        let tempMyOrders = [];
        for (var key of keys) {
          tempMyOrders.push({ id: key, ...data[key] });
        }
        store.dispatch({ type: "setMyOrders", payload: tempMyOrders });
      }
    });
  });
}

export async function seeNotification(notification) {
  let seenNotification = { ...notification, isSeen: true };
  database.ref("notifications/" + notification.id).set(seenNotification);
}
