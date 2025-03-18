const React = require('react');
const { createElement, useState, useEffect } = React;
const SignUpForm = require('./components/SignUpForm').default;
const SignIn = require('./components/SignIn').default;
const LandingPage = require('./components/LandingPage').default;
const EditProfile = require('./components/EditProfile').default;
const { onAuthStateChanged, auth, getRedirectResult, signInWithPopup } = require('./firebase');
const { GoogleAuthProvider } = require('./firebase');
// Using react-toastify v11.0.5 which should be compatible with React 19
const { ToastContainer, toast } = require('react-toastify');
require('react-toastify/dist/ReactToastify.css');
require('./animations.css');
const { Routes, Route } = require('react-router-dom');

const App = () => {
    const [isGoogleSignIn, setIsGoogleSignIn] = useState(true);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const toggleSignInMethod = () => {
        setIsGoogleSignIn(prev => !prev);
    };

    // Handle sign-in using a popup instead of redirect
    const handleSignIn = async () => {
        setIsLoading(true);
        const provider = new GoogleAuthProvider();
        // Add scopes for better user data
        provider.addScope('email');
        provider.addScope('profile');
        
        try {
            console.log('Starting Google sign-in process...');
            const result = await signInWithPopup(auth, provider);
            console.log('Google sign-in successful:', result.user.displayName);
            toast.success(`Welcome, ${result.user.displayName || 'User'}!`);
            setIsSignedIn(true);
        } catch (error) {
            console.error('Error during sign in:', error.code, error.message);
            
            // Provide more helpful error messages based on error code
            if (error.code === 'auth/popup-closed-by-user') {
                toast.info('Sign-in was cancelled. Please try again when you\'re ready.');
            } else if (error.code === 'auth/popup-blocked') {
                toast.error('Sign-in popup was blocked. Please allow popups for this site.');
            } else {
                toast.error('Authentication failed: ' + (error.message || 'Unknown error'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('Setting up auth state listener...');
        let authTimer = null;
        
        // Force loading state to resolve after a maximum time
        // This prevents the app from being stuck in loading state indefinitely
        const maxLoadingTime = setTimeout(() => {
            if (isLoading) {
                console.log('Forcing loading state to resolve after timeout');
                setIsLoading(false);
            }
        }, 5000);
        
        // Try to get any redirect result first
        getRedirectResult(auth)
            .then((result) => {
                if (result && result.user) {
                    console.log('Got redirect result, user signed in:', result.user);
                    setIsSignedIn(true);
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                console.error('Error getting redirect result:', error.code, error.message);
                // Continue with auth state change listener even if redirect fails
            });
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('Auth State Changed:', user ? 'User exists' : 'No user');
            
            // Clear any pending timers
            if (authTimer) {
                clearTimeout(authTimer);
                authTimer = null;
            }
            
            if (user) {
                console.log('User is signed in:', {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    isAnonymous: user.isAnonymous
                });
                setIsSignedIn(true);
                setIsLoading(false);
            } else {
                console.log('User is signed out.');
                setIsSignedIn(false);
                
                // Skip anonymous sign-in and just show the sign-in screen
                authTimer = setTimeout(() => {
                    console.log('No user detected, showing sign-in screen');
                    setIsLoading(false);
                }, 1000);
            }
        }, (error) => {
            console.error('Auth state change error:', error.code, error.message);
            setIsLoading(false);
        });
        
        return () => {
            console.log('Cleaning up auth state listener');
            unsubscribe();
            clearTimeout(maxLoadingTime);
            if (authTimer) clearTimeout(authTimer);
        };
    }, [isLoading, isSignedIn]);

    // Render loading state if authentication is still being processed
    if (isLoading) {
        return createElement(
            'div',
            { className: 'flex flex-col items-center justify-center min-h-screen py-8 px-4' },
            createElement(
                'div',
                { className: 'animate-pulse text-center' },
                createElement('img', {
                    src: '/images/GreatIndianWaffleLogo.png',
                    alt: 'Great Indian Waffle Logo',
                    className: 'w-80 md:w-96 mb-4'
                }),
                createElement(
                    'h2',
                    { className: 'text-xl font-semibold text-waffle-brown' },
                    'Loading...'
                )
            )
        );
    }

    return createElement(
        'div',
        { className: 'flex flex-col items-center min-h-screen py-8 px-4' },
        createElement(ToastContainer),
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
        isSignedIn ? createElement(
            'main',
            null,
            createElement(
                Routes,
                null,
                createElement(Route, { path: '/edit-profile', element: createElement(EditProfile, null) }),
                createElement(Route, { path: '/', element: createElement(LandingPage, null) })
            )
        ) : createElement(
            'main',
            { className: `w-full max-w-md bg-white rounded-lg shadow-lg p-6 md:p-8 border-t-4 border-waffle-orange flex flex-col justify-center items-center transition-all duration-500 ${isGoogleSignIn ? 'h-80' : 'h-auto'}` },
            createElement(
                'div',
                { className: `transition-opacity duration-500 ${isGoogleSignIn ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}` },
                createElement(
                    'div',
                    { className: 'flex flex-col items-center' },
                    createElement(
                        'button',
                        { className: 'bg-waffle-orange text-white py-2 px-4 rounded-lg', onClick: handleSignIn },
                        'Sign in with Google'
                    )
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
                'Taste It! Love It!'
            )
        )
    );
};

module.exports = { default: App };
