import { Link } from 'react-router';
import React from 'react';

export default props => (
    <section>
        <h1>Welcome home!</h1>

        <p>
            Read our main article <Link to="/articles/0">here</Link> or have a look at our list of articles here <Link to="/articles">here</Link>.
        </p>
    </section>
);
