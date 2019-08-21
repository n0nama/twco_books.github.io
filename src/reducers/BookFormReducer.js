import books_json from '../data/books.json';
import { ADD_BOOK} from '../actions';

function BookFormReducer(state = books_json, action) {
    switch(action.type){
        case ADD_BOOK:
            let books = [action.book, ...state];
            return books;
        default:
            return state;
    }
}

export default BookFormReducer;