import { combineReducers } from "redux";
// ## Generator Reducer Imports
import ordersReducer from './reducers/ordersReducer'
import userReducer from "./reducers/userReducer";
export default combineReducers({
  ordersReducer, userReducer
});
