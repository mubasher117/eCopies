let initialState = {
  myOrders: [],
  notifications: [],
  currentForm:{},
  currentCourt: '',
};
export default function (state = initialState, action) {
  switch (action.type) {
    case "setNotifications":
      console.log("IN orders REDUCER");
      return { ...state, notifications: action.payload };
    case "setMyOrders":
      console.log("IN REDUCER");
      return { ...state, myOrders: action.payload };
    case "setCurrentFormItem":
      console.log("IN form REDUCER");
      return {
        ...state,
        currentForm: { ...state.currentForm, ...action.payload },
      };
    case "setCurrentCourt":
      console.log("IN clear form");
      return { ...state, currentCourt: action.payload };
    case "clearForm":
      console.log("IN clear form");
      return { ...state, currentForm: {} };
    default:
      return { ...state };
  }
}
