const React = require('react');
const { createElement } = React;
const ReactDOM = require('react-dom');
const App = require('./App').default;
require('./index.css');
require('./styles.css');

ReactDOM.render(
    createElement(
        React.StrictMode,
        null,
        createElement(App, null)
    ),
    document.getElementById('root')
);
