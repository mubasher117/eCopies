import { database, getUserId } from "./authenication";
import { registerForPushNotificationsAsync } from "./authenication";

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

export async function seeNotification(notification) {
  let seenNotification = { ...notification, isSeen: true };
  database.ref("notifications/" + notification.id).set(seenNotification);
}

// Helper function to get notifications in ascending order
function getAscending(a, b) {
  if (a.createdOn > b.createdOn) {
    return 0;
  } else {
    return -1;
  }
}

// Get user's notification
export const getNotifications = async () => {
  // retrieving user data
  let state = store.getState();
  let user = state.userReducer.user;
  var dbRef = database
    .ref("notifications")
    .orderByChild("userId")
    .equalTo(user.id);
  dbRef.on("value", (snapshot) => {
    if (snapshot.val()) {
      let objArray = [];
      let data = snapshot.val();
      let keys = Object.keys(data);
      for (var key of keys) {
        objArray.push({ id: key, ...data[key] });
      }
      objArray.sort(getAscending);
      store.dispatch({
        type: "setNotifications",
        payload: objArray.reverse(),
      });
    } else {
      store.dispatch({
        type: "setNotifications",
        payload: [],
      });
    }
  });
};

export const makeUserActive = (userId) => {
  const ref = database.ref(`onlineUsers/${userId}`);
  ref.set(true).then(() => console.log("Online presenvce set "));
  ref
    .onDisconnect()
    .remove()
    .then(() => console.log("Disconnected"));
};

export function updateUserDetails(user, callBackFn) {
  let updates = {};
  updates["/name"] = user.name;
  updates["/id"] = user.id;
  updates["/address"] = user.address;
  updates["/cellNo"] = user.cellNo;
  database
    .ref("userData/")
    .child(user.id)
    .update(updates, async (data) => {
      console.log("IN USER DATA");
      console.log(data);
      callBackFn();
      await getUserData(user.id);
    });
}

// Add User balance
export const addUserBalance = (userId, balance, callBackFn) => {
  var updates = {};
  updates["/balance"] = balance;
  database
    .ref("userData/")
    .child(userId)
    .update(updates, (data) => {
      console.log("IN USER DATA");
      console.log(data);
      callBackFn(null);
    });
};

// Get additional userData
export const getUserData = (userId) => {
  // console.log(user);
  var dbRef = database.ref("/userData/" + userId);
  dbRef.once("value", (snapshot) => {
    if (snapshot.val()) {
      let data = snapshot.val();
      var user = {
        id: data.id,
        name: data.name,
        address: data.address,
        cellNo: data.cellNo,
        expoToken: data.expoToken,
        balance: data.balance,
      };
      store.dispatch({ type: "setUser", payload: user });
    } else {
      alert("user data not found");
    }
  });
};
