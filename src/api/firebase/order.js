import { database } from "./authenication";
import store from "../../redux/store";

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

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function addForm(json, callbackfn) {
  console.log(json);
  var date = Date.now();
  var newId = date + "-" + uuidv4();
  database.ref("orders/" + newId).set(json, (res) => {
    console.log(res);
    addUserBalance(json.customerId, json.totalAmount, callbackfn);
  });
}

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
