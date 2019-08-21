import React, { Component } from 'react';
import { Grid, Container } from 'semantic-ui-react';

import BookForm from './BookForm';
import BookShelf from './BookShelf';

class App extends Component {
    render () {
        return (
            <Container>
                <Grid padded className="segment">
                    <BookForm></BookForm>

                    <BookShelf></BookShelf>
                </Grid>
            </Container>
        )
    }

}

export default App;