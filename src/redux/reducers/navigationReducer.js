const initialState = {
  currentScreen: "CopyFormHomePage",
};
const setCurrentScreen = (state, action) => {
    return {...state, currentScreen: action.payload}
}
const actionMapper = {
    'SET_CURRENT_SCREEN': setCurrentScreen
}
export default (state=initialState, action) => {
    try {
        return actionMapper[action.type](state, action)
    } catch (error) {
        return state
    }
}