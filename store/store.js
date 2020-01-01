import {
    createStore,
    combineReducers,
    applyMiddleware
} from 'redux'
import ReduxThunk from 'redux-thunk' //为了执行异步action
import axios from 'axios'

const userInitialState = {}
const LOGOUT = 'LOGOUT'

const UPDATE_USERNAME = "UPDATE_USERNAME"

function userReducer(state = userInitialState, action) {
    switch (action.type) {
        case LOGOUT:
            {
                return {}
            }
        default:
            return state
    }
}
const allReducers = combineReducers({
    user: userReducer
})

const store = createStore(
    allReducers, {
        user: userInitialState
    },
    applyMiddleware(ReduxThunk)
)

store.subscribe(() => {
    console.log("!!!", store.getState())
})

store.dispatch({
    type: UPDATE_USERNAME,
    name: "JAck"
})

//action creators
export function logout() {
    return dispatch => {
        axios.post('/logout').then(resp => {
            if (resp.status === 200) {
                dispatch({
                    type: LOGOUT
                })
            } else {
                console.log('logout failed', resp)
            }
        }).catch(err => {
            console.log("err: ", err)
        })
    }
}

export default function initializeStore(state) {
    const store = createStore(
        allReducers,
        Object.assign({}, {
            user: userInitialState
        }, state),
        applyMiddleware(ReduxThunk)
    );

    return store;
}
