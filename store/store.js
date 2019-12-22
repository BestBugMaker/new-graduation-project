import {
    createStore,
    combineReducers,
    applyMiddleware
} from 'redux'
import ReduxThunk from 'redux-thunk' //为了执行异步action

const initialState = {
    count: 0
}

const userInitialState = {
    name: "Jason"
}

export function add(num) {
    return ({
        type: ADD,
        num: num
    })
}

function addAsync(num) {
    return (dispatch) => {
        setTimeout(() => {
            dispatch({
                type: ADD,
                num: num
            })
        }, 1000);
    }
}

const ADD = "ADD"

function reducer(state = initialState, action) {
    console.log(state, action)
    switch (action.type) {
        case ADD:
            return {
                count: state.count + action.num || 1
            }
        default:
            return state
    }
}

const UPDATE_USERNAME = "UPDATE_USERNAME"

function userReducer(state = userInitialState, action) {
    switch (action.type) {
        case UPDATE_USERNAME:
            return {
                ...state,
                name: action.name
            }
        default:
            return state
    }
}
const allReducers = combineReducers({
    count: reducer,
    user: userReducer
})

const store = createStore(
    allReducers, {
        count: initialState,
        user: userInitialState
    },
    applyMiddleware(ReduxThunk)
)
store.dispatch({
    type: ADD
})

store.subscribe(() => {
    console.log("!!!", store.getState())
})
store.dispatch(addAsync(5))
store.dispatch({
    type: UPDATE_USERNAME,
    name: "JAck"
})

export default function initializeStore(state) {
    const store = createStore(
        allReducers,
        Object.assign({}, {
            count: initialState,
            user: userInitialState
        }, state),
        applyMiddleware(ReduxThunk)
    );

    return store;
}
