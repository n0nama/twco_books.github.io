import books_json from '../data/books.json';
import { ADD_BOOK, EDIT_BOOK, DELETE_BOOK } from '../actions';


function BookFormReducer(state = books_json, action) {
    let data = state
    let editedBook = null
    switch(action.type){
        case ADD_BOOK:
            data = [action.book, ...state.data];
            return {data, editedBook};
        case EDIT_BOOK:
            data = state.data.filter( el => el.id !== action.id);
            editedBook = state.data.filter( el => el.id === action.id)[0]
            return {data, editedBook};
        case DELETE_BOOK:
            data = state.data.filter( el => el.id !== action.id)
            return {data, editedBook};
        default:
            return {data, editedBook};
    }
}

export default BookFormReducer;