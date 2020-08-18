import { database, getUserId } from "./authenication";
import store from "../../redux/store";
import AsyncStorage from "@react-native-community/async-storage";


export async function getMyOrders (){
  console.log("STATE : ***********");
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
          console.log(data[key]);
          tempMyOrders.push({ id: key, ...data[key] });
        }
        console.log(tempMyOrders);
        store.dispatch({ type: "setMyOrders", payload: tempMyOrders });
      }
    });
  })  
}
