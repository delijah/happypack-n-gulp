import { AppContainer } from 'react-hot-loader';
import { IndexRoute, Link, Route, Router } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';

import Home from './../routes/Home';
import Article from './../routes/Article';
import Articles from './../routes/Articles';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = { breadcrumbNav: this.generateBreadcrumbNav(props) };
    }

    componentDidMount() {
        this.setDocumentTitle();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.routes !== this.props.routes) {
            this.setState({ breadcrumbNav: this.generateBreadcrumbNav(nextProps) });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.breadcrumbNav !== this.state.breadcrumbNav) {
            this.setDocumentTitle(nextProps, nextState);
        }
    }

    render() {
        return (
            <div>
                <nav className="breadcrumb">
                    {this.state.breadcrumbNav.map((item, index) => {
                        if (item.type === 'separator') {
                            return <span key={index} className="separator">»</span>;
                        } else if (item.type === 'route') {
                            return item.href ?
                                <Link key={index} className="route" to={item.href}>{item.title}</Link> :
                                <span key={index} className="route">{item.title}</span>;
                        }
                    })}
                </nav>

                <main>
                    {this.props.children}
                </main>
            </div>
        );
    }

    setDocumentTitle(props = this.props, state = this.state) {
        document.title = state.breadcrumbNav.map(item => {
            switch (item.type) {
                case 'separator': return ' / ';
                default: return item.title;
            }
        }).join('');
    }

    generateBreadcrumbNav(props = this.props) {
        const nav = [];
        const path = [];

        props.routes.forEach((route, index) => {
            if (route.path) {
                path.push(route.path.replace(/(^\/|\/$)/g, ''));
            }

            if (route.title) {
                if (index > 0) {
                    nav.push({
                        type: 'separator',
                    });
                }

                nav.push({
                    type: 'route',
                    title: route.title,
                    href: path.join('/').replace(/:([^/]+)/g, (overallResult, groupResult) =>
                        props.params[groupResult] || overallResult
                    ) || '/',
                });
            }
        });

        nav[nav.length - 1].href = null;

        return nav;
    }
}

App.propTypes = {
    routes: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            path: React.PropTypes.string,
            title: React.PropTypes.string,
        })
    ).isRequired,
};

const render = (container, props) => {
    ReactDOM.render(
        <AppContainer>
            <Router history={props.history}>
                <Route path="/" component={App} title="MyApp">
                    <IndexRoute component={Home} title="Home" />

                    <Route path="articles" component={Articles} title="Articles">
                        <Route path=":articleId" component={Article} title="View article" />
                    </Route>
                </Route>
            </Router>
        </AppContainer>
    , container);
};

export { render };
