import { combineReducers } from "redux";
// ## Generator Reducer Imports
import ordersReducer from './reducers/ordersReducer'
import userReducer from "./reducers/userReducer";
import navigationReducer from './reducers/navigationReducer'
export default combineReducers({
  ordersReducer, userReducer, navigationReducer
});
