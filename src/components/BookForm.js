import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addNewBook } from '../actions';
import { Grid, Modal, Image, Button, Label } from 'semantic-ui-react';
import { Form, Dropdown } from 'formsy-semantic-ui-react';
import { addValidationRule } from 'formsy-react';
const XRegExp = require('xregexp');

//Custom date validation
addValidationRule('isCorrectDate', function(values, value) {
        let lowDate = new Date("01.01.1800")
        let currentDate = new Date()
        let [dd, mm, yyyy] = value ? value.split('.') : ["01", "01", "1900"]
        let inputedDate = new Date(mm + '.' + dd + '.' + yyyy)
        if ((inputedDate >= lowDate && inputedDate <= currentDate) || inputedDate.length > 0){
            return true
        }
});

addValidationRule('isCorrectYear', function(values, value) {
    let lowYear = 1800
    let currentYear = new Date().getFullYear();
    let inputedYear = parseInt(value)
    if (value && value.length > 0){
        if ((inputedYear>=lowYear&&inputedYear<=currentYear)){
            return true
        } else {
            return false
        } 
    } else {
        return true
    }

});

function maxidHelper(data){
    let maxid = 0;
    data.map(b => {
        if (b.id > maxid) {
            return maxid = b.id
        };
        return null;
    });
    return maxid;
}

class BookForm extends Component {
    state = { modal: false,
        preview : '',
        authors : this.authorsPreSet (),
        formWasSubmitted : false,
        formEditing : false,
        newAuthAdded : false
    }
    static getDerivedStateFromProps(props, state) {
        let check = props.books.editedBook ? true : false
        if (check !== state.formEditing) {
            return {
                formEditing: check,
            }
        }
        return null;
    }
    show = (e) => {
        e.preventDefault()//To prevent premature form validation
        this.setState({ modal: true })
    }
    close = () => { 
        this.setState({ modal: false }) 
    }
    imagePreview = (link) => { 
        this.setState({preview : link.target.value })
    }
    authorsPreSet () {
            /* Here I prepare list of all authors to render it in select.
           I grub all books, then map all authors from each book.
           Then I prepare flat array to use it in single dimension.
           After that I remove all duplicates using Set, and then
           I map current array to use it with select.
        */
        let allAuthors = this.props.books.data.map(book => {
            return book.authors            
        });
        let preAuth = [...new Set(allAuthors.flat(1))].filter( el => el.length > 0); //clear empty elements if exists
        let options = preAuth.map( a => {
            return (
                {key : a, text: a, value: a }
            )
        });
        return options
    }
    authorsListChange =  (e, { value }) => {
        this.setState({ selectedAuthors: value, formWasSubmitted : false })
    }
    addNewAuthor = (e) => {
        let newAuthName = e.authorFirstName + ' ' + e.authorLastName
        let newAddition = { key : newAuthName, text : newAuthName, value : newAuthName }
        let updatedAuthors = [newAddition, ...this.state.authors]
        //This statement needs to fix custom validation behavior
        if (this.state.formWasSubmitted && !this.state.formEditing) {
            let selectedAuthors = []
            if(this.state.newAuthAdded){
                selectedAuthors = this.state.selectedAuthors
            }
            let updateSelectedAuthors = selectedAuthors.concat(newAuthName)
            this.setState({ modal: false, authors : updatedAuthors, selectedAuthors : updateSelectedAuthors, newAuthAdded : true })
        } else {
            let selectedAuthors = this.state.selectedAuthors === undefined ? [] : this.state.selectedAuthors
            let updateSelectedAuthors = selectedAuthors.concat(newAuthName)
            this.setState({ modal: false, authors : updatedAuthors, selectedAuthors : updateSelectedAuthors })
        }
    }
    submitNewBook = (e) => {
        //Prepare new id
        if (!this.state.formEditing) {
            let maxid = maxidHelper(this.props.books.data)
            e.id = maxid+1
        } else {
            e.id = this.props.books.editedBook.id
        }
        let new_book = e
        this.props.addNewBook(new_book)
        this.refs.bookForm.reset()
        this.setState({formWasSubmitted : true, preview : '', newAuthAdded : false})//To clear selectedAuthors list
    }
    componentDidUpdate(prevProps){
        if ( prevProps.books.editedBook !== this.props.books.editedBook) {
            if(this.props.books.editedBook){
                this.setState({selectedAuthors : this.props.books.editedBook.authors})
            }
            this.refs.bookForm.reset(this.props.books.editedBook);
            this.setState({formWasSubmitted : true})
        }
    }
    render () {
        //For yearPublish validation
        console.log('State', this.state)
        const errorLabel = <Label basic color="red" pointing/>
        return (
            <Grid.Row>
            <Grid.Column mobile={16} largeScreen={10} table={10}>
            <Form
                onValidSubmit={this.submitNewBook}
                ref="bookForm"
                className="raised segment"
            >
                <Form.Field>
                    <Form.Input
                        required
                        label="Название"
                        placeholder="Название"
                        name="title"
                        validations={{maxLength : 30 }}
                        validationErrors={{ 
                            maxLength: 'Не более 30 символов',
                            isDefaultRequiredValue: 'Обязательное поле' }}
                        errorLabel={ errorLabel }
                    />
                    <Form.Group>
                        <Form.Field required width={14}>
                            <label>Список авторов</label>
                            <Dropdown
                                required
                                placeholder="Авторы"
                                name="authors"
                                fluid
                                multiple
                                search
                                selection
                                options={ this.state.authors }
                                validationErrors={{ 
                                    isDefaultRequiredValue: 'Добавьте хотя бы одного автора' }}
                                errorLabel={ errorLabel }
                                value={this.state.selectedAuthors}
                                onChange={this.authorsListChange}
                            />
                        </Form.Field>
                        <Form.Field width={2}>
                            <label>&nbsp;</label>
                            <Button color="brown" icon="plus" onClick={this.show}/>
                        </Form.Field>                
                    </Form.Group>
                    <Form.Input 
                        label="Издательство"
                        placeholder="Название издательства"
                        name="publisher"
                        validations={{maxLength : 30 }}
                        validationErrors={{ 
                            maxLength: 'Не более 30 символов'}}
                        errorLabel={ errorLabel }
                    />
                    <Form.Group>
                        <Form.Input
                            required
                            label="Количество страниц"
                            placeholder="Количество страниц"
                            name="pageCount"
                            width={5}
                            validations={{matchRegexp : XRegExp('^(?:[1-9][0-9]{0,3}?|10000)$') }}
                            validationErrors={{ 
                                matchRegexp: 'Неправильный формат. Допустимо количество страниц от 0 до 10000',
                                isDefaultRequiredValue: 'Обязательное поле' }}
                            errorLabel={ errorLabel }
                        />
                        <Form.Input
                            label="Год публикации"
                            placeholder="Например, 2003"
                            name="yearPublish"
                            width={5}
                            validations="isCorrectYear"
                            validationError="Неправильный формат даты."
                            errorLabel={ errorLabel }
                        />
                        <Form.Input
                            label="Дата выхода в тираж"
                            placeholder="Формат дд.мм.гггг"
                            name="publishedDate"
                            width={6}
                            validations="isCorrectDate"
                            validationError="Неправильный формат даты."
                            errorLabel={ errorLabel }
                        />
                    </Form.Group>
                    <Form.Input
                        label="ISBN"
                        placeholder="ISBN"
                        name='isbn'
                        validations={{matchRegexp : XRegExp('^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$') }}
                        validationErrors={{ matchRegexp: 'Неправильный формат ISBN.'}}
                        errorLabel={ errorLabel }
                    />
                    <Form.Input
                        label="Ссылка на изображение"
                        placeholder="URL"
                        onChange={this.imagePreview}
                        name="thumbnailUrl"/>
                </Form.Field>
                <Button type="submit" color="brown">Добавить</Button>
            </Form>
            <Modal open={this.state.modal} onClose={this.close} centered={false} size="mini">
                <Modal.Header>Добавить нового автора</Modal.Header>
                    <Modal.Content>
                        <Form onValidSubmit={this.addNewAuthor}>
                            <Form.Input
                                required
                                label="Имя"
                                name="authorFirstName"
                                validations={{maxLength : 20 }}
                                validationErrors={{ 
                                    maxLength: 'Не более 20 символов',
                                    isDefaultRequiredValue: 'Обязательное поле' }}
                                errorLabel={ errorLabel }
                            />
                            <Form.Input
                                required
                                label="Фамилия"
                                name="authorLastName"
                                validations={{maxLength : 20 }}
                                validationErrors={{ 
                                    maxLength: 'Не более 20 символов',
                                    isDefaultRequiredValue: 'Обязательное поле' }}
                                errorLabel={ errorLabel }
                            />
                            <Button type="submit" color="brown">Добавить</Button>
                        </Form>
                    </Modal.Content>
                </Modal>
            </Grid.Column>
            <Grid.Column width={6} only='large screen'>
                <br></br>
                <Image
                    fluid
                    bordered
                    rounded
                    onError={(e)=>{e.target.src="./assets/imgs/default.png"}}
                    src={ this.props.books.editedBook && this.props.books.editedBook.thumbnailUrl !== undefined ? this.props.books.editedBook.thumbnailUrl : this.state.preview ? this.state.preview : "./assets/imgs/default.png"}/>
            </Grid.Column>
        </Grid.Row>
        )
    }

}

function mapStateToProps(state){
    return {
        books : state.books
    };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({addNewBook}, dispatch);

}

export default connect(mapStateToProps,mapDispatchToProps)(BookForm);