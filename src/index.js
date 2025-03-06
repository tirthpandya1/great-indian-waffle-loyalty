const React = require('react');
const { createElement } = React;
const ReactDOM = require('react-dom/client');
const App = require('./App').default;
require('./index.css');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    createElement(
        React.StrictMode,
        null,
        createElement(App, null)
    )
);
