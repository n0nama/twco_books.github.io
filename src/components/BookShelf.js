import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Card, Image, Label } from 'semantic-ui-react';

class BookShelf extends Component {
    render () {
        return (
            <Grid.Column width={16}>
                <Card.Group stackable itemsPerRow={3}>
                    {this.props.books.map( (book, i) => {
                        return (
                            <Card key={i}>
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
                                </Card.Description>
                                </Card.Content>
                                {book.isbn ? 
                                <Card.Content extra>
                                    {book.isbn}
                                </Card.Content>
                                : null }
                            </Card>
                        )
                    })}
                </Card.Group>
            </Grid.Column>
        )
    }
}

function mapStateToProps(state){
    return {
        books : state
    };
}

export default connect(mapStateToProps)(BookShelf);