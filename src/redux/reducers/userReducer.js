let initialState={
    user: {}
}

export default function (state = initialState, action) {
  switch (action.type) {
    case "setUser":
      console.log("IN users REDUCER: ", action.payload);
      return {
        user: action.payload,
      };
    default:
      return { ...state };
  }
}
