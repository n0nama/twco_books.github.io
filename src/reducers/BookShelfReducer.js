import books_json from '../data/books.json';
import { ADD_BOOK, EDIT_BOOK, DELETE_BOOK } from '../actions';

function BookShelfReducer(state = books_json, action) {
    let books = []
    switch(action.type){
        case ADD_BOOK:
            books = [action.book, ...state];
            return books;
        case EDIT_BOOK:
            let updatedBook = state.filter( el => el.id === action.id)
            return updatedBook;
        case DELETE_BOOK:
            books = state.filter( el => el.id !== action.id)
            return books;
        default:
            return state;
    }
}

export default BookShelfReducer;