import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import { Notifications } from "expo";
import store from "../../redux/store";
import AsyncStorage from "@react-native-community/async-storage";
const firebaseConfig = {
  apiKey: "AIzaSyDa5BINSpVo4SasALNaZ8CbmXmMJOQZORI",
  authDomain: "services-72908.firebaseapp.com",
  databaseURL: "https://services-72908.firebaseio.com",
  projectId: "services-72908",
  storageBucket: "services-72908.appspot.com",
  messagingSenderId: "287376725533",
  appId: "1:287376725533:web:e980de492f7d3971e6d8f4",
  measurementId: "G-T45YZ4652P",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export var database = firebase.database();

export const getUserId = () =>
  new Promise(async (resolve, reject) => {
    // retrieving user data
    let storedUser = await AsyncStorage.getItem("@loggedUser");
    try {
      storedUser = JSON.parse(storedUser);
    } catch (error) {
      console.log("Error in parsing userId ");
    }
    let storedUserId = storedUser.user.uid;
    resolve(storedUserId);
  });

// Get user's notification on login
export const getNotifications = async () => {
  getUserId().then((userId) => {
    var dbRef = database
      .ref("notifications")
      .orderByChild("userId")
      .equalTo(userId);
    dbRef.on("value", (snapshot) => {
      if (snapshot.val()) {
        let objArray = [];
        let data = snapshot.val();
        let keys = Object.keys(data);
        for (var key of keys) {
          objArray.push({ ...data[key] });
        }
        store.dispatch({ type: "setNotifications", payload: objArray.reverse() });
      }
    });
  })
};

// const callBackLogin = async (userData) => {
//   // Storing user after login
//   try {
//     const jsonValue = JSON.stringify(userData);
//     await AsyncStorage.setItem("@loggedUser", jsonValue);
//   } catch (e) {
//     console.log("Error in callBackLogin: ", e);
//   }
// };
export const login = async (email, password, isDirect, callBackFn) => {
  console.log("IN LOGIN");
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(async (user) => {
      // Getting addtional user data
      try {
        const jsonValue = JSON.stringify(user);
        await AsyncStorage.setItem("@loggedUser", jsonValue);
      } catch (e) {
        console.log("Error in storing id: ", e);
      }
      getUserData(user);
      // if (!isDirect) {
      //   registerPushNotifications(user);
      //   callBackFn("success", user.user.uid);
      // } else {
      //   console.log("logged in after registration");
      //   callBackFn("success", user.user.uid);
      // }
      callBackFn("success", user.user.uid);
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      callBackFn("error", errorMessage);
    });
};

// Get additional userData
export const getUserData = (user) => {
  var dbRef = database.ref("/userData/" + user.user.uid);
  dbRef.on("value", (snapshot) => {
    if (snapshot.val()) {
      let data = snapshot.val();
      user = { user, ...data };
      store.dispatch({ type: "setUser", payload: user });
    } else {
      console.log("user data not found");
    }
  });
};

export const register = async (userInputDetails, callBackFn) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(
      userInputDetails.email,
      userInputDetails.password
    )
    .then((user) => {
      console.log(user.user.uid);
      let userDetails = {
        id: user.user.uid,
        ...userInputDetails,
      };
      //registerUserInDb(userDetails, callBackFn); // Creates other information in db for that user
      var additionalDetails = {
        id: user.user.uid,
        name: userDetails.name,
        cellNo: userDetails.cellNo,
        address: userDetails.address,
        balance: 0,
      };
      console.log("ADDITIONAL DETAILS");
      console.log(userDetails);
      addAddtionalUserDetails(
        additionalDetails,
        userInputDetails.email,
        userInputDetails.password,
        callBackFn
      );
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error);
      callBackFn("error", errorMessage);
      // ...
    });
};
export const addAddtionalUserDetails = (
  userDetails,
  email,
  password,
  callBackFn
) => {
  database.ref("userData/" + userDetails.id).set(userDetails, (response) => {
    console.log(response);
    login(email, password, true, callBackFn);
  });
};

export const checkSignedIn = async () => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("User Signed In");
      return true;
    } else {
      console.log("User not signed in");
      return false;
    }
  });
};
export const logout = async() => {
  firebase
    .auth()
    .signOut()
    .then(async() => {
      console.log("User logged out");
      await AsyncStorage.removeItem("@loggedUser");
    })
    .catch(function (error) {
      console.log(error);
    });
};

// Sets extra details of user in db
const registerUserInDb = async (userDetails, callBackFn) => {
  let token = await Notifications.getExpoPushTokenAsync();
  console.log(token);
  database.ref("userData/" + userDetails.id).set(
    {
      name: userDetails.name,
      cellNo: userDetails.cellNo,
      address: userDetails.address,
      // ExpoToken: token,
      balance: 0,
    },
    (error) => {
      if (error) {
        callBackFn("failure", "user did not added");
      } else {
        callBackFn("success", "user added successfully");
      }
    }
  );
};
const registerPushNotifications = async (user) => {
  console.log(user.user.uid);
  let token = await Notifications.getExpoPushTokenAsync();
  console.log(token);
  var updates = {};
  updates["/ExpoToken"] = token;
  database
    .ref("userData/")
    .child(user.user.uid)
    .update(updates, (data) => {
      console.log(data);
    });
};
// Generates universally unique id
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
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
export function addForm(json, callbackfn) {
  console.log(json);
  database.ref("pendingForms/" + uuidv4()).set(json, () => {
    addUserBalance(json.customerId, json.totalAmount, callbackfn);
  });
}
