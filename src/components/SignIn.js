const React = require('react');
const { createElement } = React;
const { auth } = require('../firebase');
const { GoogleAuthProvider, signInWithRedirect } = require('firebase/auth');

const SignIn = () => {
    const provider = new GoogleAuthProvider();
    
    // Add scopes for better user profile access
    provider.addScope('profile');
    provider.addScope('email');
    
    // Set custom parameters
    provider.setCustomParameters({
        prompt: 'select_account'
    });

    const handleSignIn = async () => {
        try {
            console.log('Starting Google sign-in process...');
            await signInWithRedirect(auth, provider);
            console.log('Redirecting to Google sign-in...');
        } catch (error) {
            console.error('Error during sign in:', error.message, error.stack);
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
