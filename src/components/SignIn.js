const React = require('react');
const { createElement } = React;
const { auth } = require('../firebase');
const { GoogleAuthProvider, signInWithPopup } = require('firebase/auth');

const SignIn = () => {
    const provider = new GoogleAuthProvider();

    const handleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('User signed in:', user);
            // Here you can also redirect the user to the main page or perform other actions
        } catch (error) {
            console.error('Error during sign in:', error);
        }
    };

    return createElement(
        'div', 
        { className: "flex flex-col items-center" },
        createElement(
            'h2', 
            { className: "text-2xl font-semibold text-waffle-brown mb-4" },
            'Sign In'
        ),
        createElement(
            'button',
            { 
                onClick: handleSignIn, 
                className: "bg-waffle-brown text-white py-2 px-4 rounded-lg hover:bg-waffle-red transition-all"
            },
            'Sign in with Google'
        )
    );
};

module.exports = { default: SignIn };
