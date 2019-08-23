import { combineReducers } from 'redux';
import books from './BookFormReducer';
//import BookShelfReducer from './BookShelfReducer';

const rootReducer = combineReducers({
    books
})

export default rootReducer;