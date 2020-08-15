let initialState = {
  myOrders: [],
  notifications: [],
};
export default function (state = initialState, action) {
  switch (action.type) {
    case "setNotifications":
      console.log("IN orders REDUCER");
      return { notifications: action.payload };
    case "setMyOrders":
      console.log("IN REDUCER");
      return { myOrders: action.payload };
    default:
      return { ...state };
  }
}
