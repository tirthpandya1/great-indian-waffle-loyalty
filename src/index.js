const React = require('react');
const { createElement } = React;
const ReactDOM = require('react-dom');
const { BrowserRouter } = require('react-router-dom');
const App = require('./App').default;
require('./index.css');
require('./styles.css');

ReactDOM.render(
    createElement(
        React.StrictMode,
        null,
        createElement(BrowserRouter, null,
            createElement(App, null)
        )
    ),
    document.getElementById('root')
);
