export const ADD_BOOK = 'ADD_BOOK';


export function addNewBook(book) {
    const action = {
        type: ADD_BOOK,
        book
    }
    return action;
}