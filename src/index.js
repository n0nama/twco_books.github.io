import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';

import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from "redux";
import { save, load } from "redux-localstorage-simple"

import rootReducer from './reducers';

const createStoreWithMiddleware = applyMiddleware(save())(createStore)
const store = createStoreWithMiddleware(rootReducer,load())

//const store = createStore(rootReducer);

ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>
        ,document.getElementById('root'));