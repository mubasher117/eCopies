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
      return {...state,  myOrders: action.payload };
    case 'setCurrentFormItem':
      console.log("IN form REDUCER");
      return { ...state, currentForm: { ...state.currentForm, ...action.payload } };
    case 'clearForm':
      return{...state, currentForm:{}}
    default:
      return { ...state };
  }
}
