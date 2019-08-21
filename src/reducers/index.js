import { combineReducers } from 'redux';
//import BookFormReducer from './BookFormReducer';
import BookShelfReducer from './BookShelfReducer';

const rootReducer = combineReducers({
    BookShelfReducer
})

export default rootReducer;