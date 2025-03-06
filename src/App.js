const React = require('react');
const { createElement } = React;
const SignUpForm = require('./components/SignUpForm').default;

const App = () => {
    return createElement(
        'div',
        { className: 'flex flex-col items-center min-h-screen py-8 px-4' },
        createElement(
            'header',
            { className: 'w-full max-w-4xl flex flex-col items-center mb-8' },
            createElement('img', {
                src: '/images/logo.svg',
                alt: 'Great Indian Waffle Logo',
                className: 'w-64 md:w-80 mb-4'
            }),
            createElement(
                'h1',
                { className: 'text-3xl md:text-4xl font-bold text-waffle-brown text-center' },
                'Loyalty Program'
            ),
            createElement(
                'p',
                { className: 'text-waffle-brown text-lg mt-2 text-center max-w-xl' },
                'Join our loyalty program today and enjoy exclusive offers, birthday surprises, and special discounts!'
            )
        ),
        createElement(
            'main',
            { className: 'w-full max-w-md bg-white rounded-lg shadow-lg p-6 md:p-8 border-t-4 border-waffle-orange' },
            createElement(SignUpForm, null)
        ),
        createElement(
            'footer',
            { className: 'mt-12 text-center text-waffle-brown text-sm' },
            createElement(
                'p',
                null,
                '© ' + new Date().getFullYear() + ' Great Indian Waffle. All rights reserved.'
            ),
            createElement(
                'p',
                { className: 'mt-1' },
                'Delicious waffles made with love!'
            )
        )
    );
};

module.exports = { default: App };
