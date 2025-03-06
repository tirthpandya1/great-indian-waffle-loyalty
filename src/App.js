const React = require('react');
const { createElement, useState, useEffect } = React;
const SignUpForm = require('./components/SignUpForm').default;
const SignIn = require('./components/SignIn').default;
const LandingPage = require('./components/LandingPage').default;
const { onAuthStateChanged, auth } = require('./firebase');

const App = () => {
    const [isGoogleSignIn, setIsGoogleSignIn] = useState(true);
    const [isSignedIn, setIsSignedIn] = useState(false);

    const toggleSignInMethod = () => {
        setIsGoogleSignIn(prev => !prev);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsSignedIn(true);
            } else {
                setIsSignedIn(false);
            }
        });
        return () => unsubscribe();
    }, []);

    return createElement(
        'div',
        { className: 'flex flex-col items-center min-h-screen py-8 px-4' },
        createElement(
            'header',
            { className: 'w-full max-w-4xl flex flex-col items-center mb-2' },
            createElement('img', {
                src: '/images/GreatIndianWaffleLogo.png',
                alt: 'Great Indian Waffle Logo',
                className: 'w-80 md:w-96 mb-1'
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
        isSignedIn ? createElement(LandingPage, null) : createElement(
            'main',
            { className: `w-full max-w-md bg-white rounded-lg shadow-lg p-6 md:p-8 border-t-4 border-waffle-orange flex flex-col justify-center items-center transition-all duration-500 ${isGoogleSignIn ? 'h-80' : 'h-auto'}` },
            createElement(
                'div',
                { className: `transition-opacity duration-500 ${isGoogleSignIn ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}` },
                createElement(
                    'div',
                    { className: 'flex flex-col items-center' },
                    createElement(SignIn, null)
                )
            ),
            createElement(
                'div',
                { className: `transition-opacity duration-500 ${isGoogleSignIn ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}` },
                createElement(SignUpForm, null)
            ),
            createElement(
                'button',
                { className: 'mt-4 text-waffle-brown underline text-center', onClick: toggleSignInMethod },
                isGoogleSignIn ? 'Switch to Manual Entry' : 'Sign in with Google'
            )
        ),
        createElement(
            'footer',
            { className: 'mt-12 text-center text-waffle-brown text-sm' },
            createElement(
                'p',
                null,
                ' ' + new Date().getFullYear() + ' Great Indian Waffle. All rights reserved.'
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
