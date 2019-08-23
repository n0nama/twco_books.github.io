import books_json from '../data/books.json';
import { ADD_BOOK, EDIT_BOOK, DELETE_BOOK, SORT_BOOKS } from '../actions';


function books(state = books_json, action) {
    let data = state.data ? state.data : state
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
        case SORT_BOOKS:
            switch(action.order){
                case 'TitleASC':
                    data = state.data.slice().sort(function(a, b){
                        if(a.title < b.title) { return -1; }
                        if(a.title > b.title) { return 1; }
                        return 0;
                    })
                    return {data, editedBook};
                case 'TitleDESC':
                    data = state.data.slice().sort(function(a, b){
                        if(a.title > b.title) { return -1; }
                        if(a.title < b.title) { return 1; }
                        return 0;
                    })
                    return {data, editedBook};
                case 'YearASC':
                    data = state.data.slice().sort(function(a, b){
                        return a.yearPublish - b.yearPublish;
                    })
                    return {data, editedBook};
                case 'YearDESC':
                    data = state.data.slice().sort(function(a, b){
                        return b.yearPublish - a.yearPublish;
                    })
                    return {data, editedBook};
                default:
                    return {data, editedBook};
            }
        default:
            return {data, editedBook};
    }
}

export default books;