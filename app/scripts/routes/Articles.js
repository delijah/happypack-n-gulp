import { Link } from 'react-router';
import React from 'react';

export default props => {
    if (React.Children.count(props.children)) {
        return props.children;
    } else {
        return (
            <section>
                <h1>List of articles</h1>

                <ul>
                    <li>
                        <Link to="/articles/0">Our main article</Link>
                    </li>
                </ul>
            </section>
        );
    }
};
