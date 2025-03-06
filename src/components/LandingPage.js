const React = require('react');
const { createElement } = React;

const LandingPage = () => {
    return createElement(
        'div',
        { className: 'flex flex-col items-center justify-center min-h-screen bg-white' },
        createElement('h1', { className: 'text-4xl font-bold text-waffle-brown' }, 'Welcome to the Loyalty Program!'),
        createElement('p', { className: 'mt-4 text-lg text-gray-600' }, 'You are successfully signed in.'),
        createElement('p', { className: 'mt-2 text-lg text-gray-600' }, 'Enjoy exclusive offers, birthday surprises, and special discounts!')
    );
};

module.exports = { default: LandingPage };
