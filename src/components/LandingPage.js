const React = require('react');
const { createElement, useState, useEffect } = React;
// Temporarily disable react-confetti due to compatibility issues with React 19
// const ReactConfetti = require('react-confetti');
const FallingWaffles = require('./FallingWaffles').default;
const UserProfile = require('./UserProfile').default;
const { auth, onAuthStateChanged } = require('../firebase');
const { useNavigate } = require('react-router-dom');

const LandingPage = () => {
    const navigate = useNavigate();
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [showConfetti, setShowConfetti] = useState(true);
    const [user, setUser] = useState(auth.currentUser);
    
    // Update user state when auth changes
    useEffect(() => {
        console.log('LandingPage mounted');
        
        // Check if we have a current user
        if (auth.currentUser) {
            console.log('Current user found on mount:', {
                uid: auth.currentUser.uid,
                email: auth.currentUser.email,
                displayName: auth.currentUser.displayName
            });
            setUser(auth.currentUser);
        } else {
            console.log('No current user found on mount');
        }
        
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                console.log('Auth state changed - user signed in:', {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    displayName: currentUser.displayName
                });
                setUser(currentUser);
            } else {
                console.log('Auth state changed - user signed out');
                setUser(null);
            }
        });
        
        return () => {
            console.log('LandingPage unmounting, unsubscribing from auth state changes');
            unsubscribe();
        };
    }, []);

    // Handle window resize for confetti
    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Temporarily disable confetti effect due to compatibility issues with React 19
    /*
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);
    */

    return createElement(
        'div',
        { className: 'flex flex-col items-center min-h-screen bg-gradient-to-b from-white to-orange-50 py-8 px-4 relative overflow-hidden' },
        
        // Temporarily disable confetti effect due to compatibility issues with React 19
        /*
        showConfetti && ReactConfetti && createElement(ReactConfetti, {
            width: dimensions.width,
            height: dimensions.height,
            recycle: false,
            numberOfPieces: 500,
            colors: ['#5B3A29', '#A52A2A', '#FF8C00', '#FFD700', '#FFFFFF']
        }),
        */
        
        // Falling waffles background
        createElement(FallingWaffles),
        
        // Welcome header
        createElement(
            'div',
            { className: 'text-center mb-8 z-10 bounce-animation' },
            createElement(
                'h1',
                { className: 'text-4xl md:text-5xl font-bold text-waffle-brown' },
                'Welcome to Your Waffle Rewards!'
            ),
            createElement(
                'p',
                { className: 'mt-4 text-lg text-waffle-brown opacity-90' },
                `Hello ${user?.displayName || 'Waffle Lover'}! Enjoy your exclusive rewards and offers.`
            )
        ),
        
        // User profile and rewards section
        createElement(UserProfile),
        
        // Buttons for navigation and logout
        createElement(
            'div',
            { className: 'flex flex-wrap justify-center gap-4 mt-4' },
            createElement(
                'button',
                {
                    className: 'bg-waffle-brown text-white px-4 py-2 rounded hover:bg-opacity-80',
                    onClick: () => auth.signOut() // Handle sign out
                },
                'Logout'
            ),
            createElement(
                'button',
                {
                    className: 'bg-waffle-brown text-white px-4 py-2 rounded hover:bg-opacity-80',
                    onClick: () => navigate('/edit-profile') // Navigate to profile edit page
                },
                'Edit Profile'
            ),
            createElement(
                'button',
                {
                    className: 'bg-waffle-orange text-white px-4 py-2 rounded hover:bg-opacity-80',
                    onClick: () => navigate('/firestore-test') // Navigate to Firestore test page
                },
                'Test Firestore Connection'
            )
        ),
        
        // Footer
        createElement(
            'div',
            { className: 'mt-12 text-center text-waffle-brown text-sm z-10' },
            createElement(
                'p',
                null,
                'Visit us in-store to redeem your rewards!'
            )
        )
    );
};

module.exports = { default: LandingPage };
