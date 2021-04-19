let initialState = {
  myOrders: [],
  notifications: [],
  currentForm:{},
  currentCourt: '',
  isUrgent: false,
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
      return { ...state, currentCourt: action.payload };
    case "clearForm":
      console.log("IN clear form");
      return { ...state, currentForm: {} };
    case "setUrgent":
      console.log("IN setUrgent form");
      return { ...state, isUrgent: action.payload };
    default:
      return { ...state };
  }
}
