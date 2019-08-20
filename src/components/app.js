import React, { Component } from 'react';
import { Divider, Grid, Container } from 'semantic-ui-react';

import BookForm from './BookForm';
import BookShelf from './BookShelf';

class App extends Component {
    render () {
        return (
            <Container>
                <Grid padded className="segment">
                    <BookForm></BookForm>
                    <Grid.Column width={16}>
                        <Divider />
                    </Grid.Column>
                    <BookShelf></BookShelf>
                </Grid>
            </Container>
        )
    }

}

export default App;