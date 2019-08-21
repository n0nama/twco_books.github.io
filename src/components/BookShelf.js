import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { editBook, deleteBook } from '../actions';
import { Grid, Card, Image, Label, Button, Icon, Menu, Divider, Modal } from 'semantic-ui-react';

class BookShelf extends Component {
    state = { open: false, deletingBookID: '' }
    show = (id) => this.setState({ open: true, deletingBookID : id })
    close = () => this.setState({ open: false, deletingBookID : '' })
    deleteBookHandler (id) {
        this.props.deleteBook(id);
        this.setState({ open: false})
    }
    render () {
        return (
            <Grid.Row>
            <Grid.Column width={16}>
                <Menu text>
                    <Menu.Item header>СОРТИРОВКА</Menu.Item>
                        <Menu.Item
                            name='Название'
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Год выпуска'
                            onClick={this.handleItemClick}
                        />
                </Menu>
            </Grid.Column>
            <Grid.Column width={16}>
                <Divider />
            </Grid.Column>
            <Grid.Column width={16}>
                <Card.Group stackable itemsPerRow={3}>
                    {this.props.books.map( (book) => {
                        return (
                            <Card key={book.id}>
                                <Image src={book.thumbnailUrl ? book.thumbnailUrl : "./assets/imgs/default.png"} wrapped ui={false} />
                                <Card.Content>
                                <Card.Header>{book.title}</Card.Header>
                                <Card.Meta>
                                    {book.publisher}<br></br>
                                    {book.yearPublish}
                                </Card.Meta>
                                </Card.Content>
                                <Card.Content>
                                <Card.Description>
                                    {book.authors.map(a => {
                                        return <Label key={a}>{a}</Label>
                                    })}
                                </Card.Description>
                                <Card.Description>
                                    <br></br>
                                    {book.publishedDate ? <p><b>Дата выхода в тираж: </b> {book.publishedDate}</p> : null}
                                    <p><b>Количество страниц: </b> {book.pageCount}</p>
                                    {book.isbn ? <p><b>ISBN: </b> {book.isbn}</p> : null}
                                </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <Button basic icon color='green' onClick={() => this.props.editBook(book.id)}>
                                        <Icon name="pencil"></Icon>
                                    </Button>
                                    <Button basic icon color='red' onClick={() => this.show(book.id)}>
                                        <Icon name="close"></Icon>
                                    </Button>
                                </Card.Content>
                            </Card>
                        )
                    })}
                </Card.Group>
            </Grid.Column>
            <Modal size="mini" open={this.state.open} onClose={this.close}>
                <Modal.Header>Удалить книгу</Modal.Header>
                <Modal.Content>
                    <p>Вы уверены, что хотите удалить книгу?</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={this.close}>Нет</Button>
                    <Button positive icon='checkmark' labelPosition='right' content='Да' onClick={() => this.deleteBookHandler(this.state.deletingBookID)}/>
                </Modal.Actions>
            </Modal>
            </Grid.Row>
        )
    }
}

function mapStateToProps(state){
    return {
        books : state.BookShelfReducer
    };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({deleteBook, editBook}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BookShelf);