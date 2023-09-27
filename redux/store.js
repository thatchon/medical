import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';
import { userReducer } from './reducers';

const rootReducer = combineReducers({
  user: userReducer,
});

const store = createStore(rootReducer);
// const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;