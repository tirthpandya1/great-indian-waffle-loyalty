const React = require('react');
const { createElement, useState, useEffect } = React;
const mockUserData = require('../utils/mockUserData');
const { auth, db } = require('../firebase');
const { doc, getDoc } = require('firebase/firestore');

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('points');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Default data structure similar to mockUserData but with empty/default values
    const defaultUserData = {
        profile: {
            name: '',
            email: '',
            avatar: 'https://ui-avatars.com/api/?name=W&background=FF8C00&color=fff',
            tier: 'Bronze',
            joinDate: new Date().toISOString()
        },
        loyalty: {
            points: 0,
            nextReward: 100,
            progress: 0
        },
        coupons: [],
        recentTransactions: []
    };
    
    // Merge with mock data for development (will be replaced with real data)
    const { profile, loyalty, coupons, recentTransactions } = userData || mockUserData;
    
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            const currentUser = auth.currentUser;
            
            if (!currentUser) {
                console.log('No authenticated user found');
                setUserData(null);
                setLoading(false);
                return;
            }
            
            try {
                // Get user data from Firestore
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                
                if (userDoc.exists()) {
                    const firestoreData = userDoc.data();
                    console.log('Firestore user data:', firestoreData);
                    
                    // Create user data object with Firestore data and fallbacks
                    // Note: We prioritize photoURL from Firestore over the one from Firebase Auth
                    const userData = {
                        profile: {
                            name: currentUser.displayName || firestoreData.displayName || 'Waffle Lover',
                            email: currentUser.email || firestoreData.email || 'No email provided',
                            avatar: firestoreData.photoURL || currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'W')}&background=FF8C00&color=fff`,
                            tier: firestoreData.tier || 'Bronze',
                            joinDate: firestoreData.createdAt || currentUser.metadata.creationTime || new Date().toISOString()
                        },
                        loyalty: {
                            points: firestoreData.points || 0,
                            nextReward: 100,
                            progress: (firestoreData.points || 0) % 100
                        },
                        coupons: firestoreData.coupons || [],
                        recentTransactions: firestoreData.transactions || []
                    };
                    
                    setUserData(userData);
                } else {
                    console.log('No user document found in Firestore, using auth data only');
                    // Create user data object with auth data only
                    const userData = {
                        profile: {
                            name: currentUser.displayName || 'Waffle Lover',
                            email: currentUser.email || 'No email provided',
                            avatar: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'W')}&background=FF8C00&color=fff`,
                            tier: 'Bronze',
                            joinDate: currentUser.metadata.creationTime || new Date().toISOString()
                        },
                        loyalty: {
                            points: 0,
                            nextReward: 100,
                            progress: 0
                        },
                        coupons: [],
                        recentTransactions: []
                    };
                    
                    setUserData(userData);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Fallback to auth data only on error
                const userData = {
                    profile: {
                        name: currentUser.displayName || 'Waffle Lover',
                        email: currentUser.email || 'No email provided',
                        avatar: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'W')}&background=FF8C00&color=fff`,
                        tier: 'Bronze',
                        joinDate: currentUser.metadata.creationTime || new Date().toISOString()
                    },
                    loyalty: mockUserData.loyalty,
                    coupons: mockUserData.coupons,
                    recentTransactions: mockUserData.recentTransactions
                };
                
                setUserData(userData);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUserData();
        
        // Listen for auth state changes to refresh data
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchUserData();
            } else {
                setUserData(null);
            }
        });
        
        return () => unsubscribe();
    }, []);

    return createElement(
        'div',
        { className: 'bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl slide-in' },
        // Loading state
        loading && createElement(
            'div',
            { className: 'flex justify-center items-center py-8' },
            createElement(
                'div',
                { className: 'animate-pulse flex flex-col items-center' },
                createElement('div', { className: 'w-24 h-24 bg-gray-200 rounded-full' }),
                createElement('div', { className: 'h-4 bg-gray-200 rounded w-48 mt-4' }),
                createElement('div', { className: 'h-3 bg-gray-200 rounded w-32 mt-2' })
            )
        ),
        
        // Profile Header (only shown when not loading)
        !loading && createElement(
            'div',
            { className: 'flex flex-col items-center mb-8' },
            
            // User avatar and tier
            createElement(
                'div',
                { className: 'relative mb-4' },
                createElement('img', {
                    src: profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'W')}&background=FF8C00&color=fff`,
                    alt: profile.name,
                    className: 'w-24 h-24 rounded-full border-4 border-waffle-orange object-cover',
                    onError: (e) => {
                        // If the data URL fails to load, fall back to a default avatar
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'W')}&background=FF8C00&color=fff`;
                    }
                }),
                createElement(
                    'div',
                    { className: 'absolute -top-2 -right-2 bg-waffle-brown text-white text-xs px-2 py-1 rounded-full' },
                    profile.tier
                )
            ),
            
            // User info
            createElement(
                'div',
                { className: 'text-center mb-4' },
                createElement(
                    'h2',
                    { className: 'text-2xl font-bold text-waffle-brown' },
                    profile.name
                ),
                createElement(
                    'p',
                    { className: 'text-gray-600' },
                    profile.email
                ),
                createElement(
                    'p',
                    { className: 'text-sm text-gray-500' },
                    `Member since ${new Date(profile.joinDate).toLocaleDateString()}`
                )
            ),
            
            // Waffle points card (centered)
            createElement(
                'div',
                { className: 'bg-waffle-orange/10 rounded-lg p-6 w-full max-w-sm mx-auto pulse-animation' },
                createElement(
                    'div',
                    { className: 'text-center' },
                    createElement(
                        'span',
                        { className: 'text-sm text-waffle-brown font-medium' },
                        'WAFFLE POINTS'
                    ),
                    createElement(
                        'h3',
                        { className: 'text-4xl font-bold text-waffle-brown mt-2' },
                        loyalty.points
                    ),
                    createElement(
                        'div',
                        { className: 'w-full bg-gray-200 rounded-full h-3 mt-3' },
                        createElement(
                            'div',
                            {
                                className: 'bg-waffle-orange h-3 rounded-full transition-all duration-500',
                                style: { width: `${loyalty.progress}%` }
                            }
                        )
                    ),
                    createElement(
                        'p',
                        { className: 'text-sm text-gray-600 mt-2' },
                        `${loyalty.points}/${loyalty.nextReward} points to next reward`
                    )
                )
            )
        ),

        // Tabs
        createElement(
            'div',
            { className: 'border-b border-gray-200 mb-6' },
            createElement(
                'div',
                { className: 'flex space-x-4' },
                createElement(
                    'button',
                    {
                        className: `py-2 px-1 border-b-2 ${activeTab === 'points' ? 'border-waffle-orange text-waffle-brown font-medium' : 'border-transparent text-gray-500'}`,
                        onClick: () => setActiveTab('points')
                    },
                    'Points History'
                ),
                createElement(
                    'button',
                    {
                        className: `py-2 px-1 border-b-2 ${activeTab === 'coupons' ? 'border-waffle-orange text-waffle-brown font-medium' : 'border-transparent text-gray-500'}`,
                        onClick: () => setActiveTab('coupons')
                    },
                    'My Coupons'
                )
            )
        ),

        // Tab Content
        activeTab === 'points' ?
            // Points History
            createElement(
                'div',
                { className: 'space-y-4 fade-in' },
                createElement(
                    'h3',
                    { className: 'text-lg font-semibold text-waffle-brown' },
                    'Recent Transactions'
                ),
                recentTransactions.map((transaction, index) =>
                    createElement(
                        'div',
                        {
                            key: transaction.id,
                            className: `bg-white border border-gray-200 rounded-lg p-4 shadow-sm slide-in delay-${index + 1}`
                        },
                        createElement(
                            'div',
                            { className: 'flex justify-between items-start' },
                            createElement(
                                'div',
                                null,
                                createElement(
                                    'p',
                                    { className: 'font-medium text-waffle-brown' },
                                    new Date(transaction.date).toLocaleDateString()
                                ),
                                createElement(
                                    'p',
                                    { className: 'text-sm text-gray-600' },
                                    transaction.items.join(', ')
                                )
                            ),
                            createElement(
                                'div',
                                { className: 'text-right' },
                                createElement(
                                    'p',
                                    { className: 'font-medium' },
                                    `₹${transaction.amount}`
                                ),
                                createElement(
                                    'p',
                                    { className: 'text-sm text-waffle-orange font-medium' },
                                    `+${transaction.points} points`
                                )
                            )
                        )
                    )
                )
            ) :
            // Coupons
            createElement(
                'div',
                { className: 'space-y-4 fade-in' },
                createElement(
                    'h3',
                    { className: 'text-lg font-semibold text-waffle-brown' },
                    'Available Coupons'
                ),
                createElement(
                    'div',
                    { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                    coupons.map((coupon, index) =>
                        createElement(
                            'div',
                            {
                                key: coupon.id,
                                className: `border border-dashed border-waffle-orange rounded-lg p-4 relative overflow-hidden slide-in delay-${index + 1}`
                            },
                            createElement('div', { className: 'shimmer-effect absolute inset-0 opacity-20' }),
                            createElement(
                                'div',
                                { className: 'flex justify-between' },
                                createElement(
                                    'h4',
                                    { className: 'text-lg font-bold text-waffle-brown' },
                                    coupon.title
                                ),
                                createElement(
                                    'span',
                                    { className: 'text-xs bg-waffle-orange text-white px-2 py-1 rounded-full' },
                                    'ACTIVE'
                                )
                            ),
                            createElement(
                                'p',
                                { className: 'text-gray-600 text-sm mt-2' },
                                coupon.description
                            ),
                            createElement(
                                'div',
                                { className: 'mt-4 flex justify-between items-center' },
                                createElement(
                                    'p',
                                    { className: 'text-xs text-gray-500' },
                                    `Expires: ${new Date(coupon.expiryDate).toLocaleDateString()}`
                                ),
                                createElement(
                                    'span',
                                    { className: 'font-mono text-sm bg-gray-100 px-2 py-1 rounded' },
                                    coupon.code
                                )
                            )
                        )
                    )
                )
            )
    );
};

module.exports = { default: UserProfile };
