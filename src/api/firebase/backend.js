import { database, getUserId } from "./authenication";
import store from "../../redux/store";
import { registerForPushNotificationsAsync } from "./authenication";
export const getMyOrders = () =>
  new Promise((resolve, reject) => {
    // retrieving user data
    let state = store.getState();
    let user = state.userReducer.user;
    console.log("MY ORDERS USERID:   ", user.id);
    var dbRef = database
      .ref("/orders")
      .orderByChild("customerId")
      .equalTo(user.id)
      .limitToLast(20);
    dbRef.on("value", (snapshot) => {
      let data = snapshot.val();
      if (data) {
        let keys = Object.keys(data);
        let tempMyOrders = [];
        for (var key of keys) {
          tempMyOrders.push({ id: key, ...data[key] });
        }
        store.dispatch({ type: "setMyOrders", payload: tempMyOrders });
        resolve(tempMyOrders.reverse());
      } else {
        store.dispatch({ type: "setMyOrders", payload: [] });
        resolve([]);
      }
    });
  });
export async function seeNotification(notification) {
  let seenNotification = { ...notification, isSeen: true };
  database.ref("notifications/" + notification.id).set(seenNotification);
}

// Adds user's extra details to userData collction
export const addAdditionalDetails = (userDetails) => {
  console.log("IN Add details", userDetails.id);
  database
    .ref("userData/" + userDetails.id)
    .set(userDetails, async (response) => {
      console.log(response);
      await registerForPushNotificationsAsync(userDetails.id);
    });
};

// export const getFormPrice = (court, type) => new Promise((resolve, reject) => {
//   database.ref(`prices/copyForm/${court}/${type}`).once('value', (snapshot) => {
//     console.log("PRICE IS:   ", snapshot.val())
//     resolve(snapshot.val())
//   })
// })
export const getFormPrice = (court, type) => {
  database.ref(`prices/copyForm/${court}/${type}`).once("value", (snapshot) => {
    // console.log("PRICE IS:   ", snapshot.val());
    return snapshot.val();
  });
};

export const getFormPrices = () =>
  new Promise((resolve, reject) => {
    database.ref("prices/copyForm").once("value", (snapshot) => {
      if (snapshot.val()) {
        resolve(snapshot.val());
      } else {
        reject();
      }
    });
  });

export const getTrackingId = () =>
  new Promise((resolve, reject) => {
    getMyOrders().then((orders) => {
      let trackingId = null;
      orders.map((order) => {
        try {
          if (order.status == "Posted") {
            trackingId = order.progress.postDetails.trackingId;
          }
        } catch (error) {
          reject(err);
        }
      });
      if (trackingId) {
        resolve(trackingId);
      } else {
        reject("Your order is not posted yet or you don't have any order.");
      }
    });
  });
