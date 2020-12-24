import {
    createStore,
    applyMiddleware,

} from 'redux'

import thunkMiddleware from "redux-thunk"
import rootReducer from './rootReducer'
import { composeWithDevTools } from 'redux-devtools-extension'

function configureStore() {
    const middlewares = [thunkMiddleware];
    const middleWareEnhancer = applyMiddleware(...middlewares);

    const store = createStore(
        rootReducer,
        composeWithDevTools(middleWareEnhancer)
    );

    return store;
}
const store = configureStore();

export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;

