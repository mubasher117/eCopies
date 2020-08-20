let initialState = {
  myOrders: [],
  notifications: [],
  currentForm:{}
};
export default function (state = initialState, action) {
  switch (action.type) {
    case "setNotifications":
      console.log("IN orders REDUCER");
      return {...state, notifications: action.payload };
    case "setMyOrders":
      console.log("IN REDUCER");
      return { myOrders: action.payload };
    case 'setCurrentFormItem':
      return {...state, currentForm: action.payload }
    default:
      return { ...state };
  }
}
