const React = require('react');
const { createElement } = React;
const ReactDOM = require('react-dom/client');
const App = require('./App').default;
const { BrowserRouter } = require('react-router-dom');
require('./index.css');
require('./styles.css');

// Create a root using the new React 19 API
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app using the root.render method
root.render(
    createElement(
        React.StrictMode,
        null,
        createElement(BrowserRouter, null, createElement(App, null))
    )
);
