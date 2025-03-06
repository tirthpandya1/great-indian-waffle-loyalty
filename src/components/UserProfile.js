const React = require('react');
const { createElement, useState } = React;
const mockUserData = require('../utils/mockUserData');

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('points');
    const { profile, loyalty, coupons, recentTransactions } = mockUserData;

    return createElement(
        'div',
        { className: 'bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl slide-in' },
        // Profile Header
        createElement(
            'div',
            { className: 'flex flex-col md:flex-row items-center md:items-start gap-6 mb-8' },
            createElement(
                'div',
                { className: 'relative' },
                createElement('img', {
                    src: profile.avatar,
                    alt: profile.name,
                    className: 'w-24 h-24 rounded-full border-4 border-waffle-orange object-cover'
                }),
                createElement(
                    'div',
                    { className: 'absolute -top-2 -right-2 bg-waffle-brown text-white text-xs px-2 py-1 rounded-full' },
                    profile.tier
                )
            ),
            createElement(
                'div',
                { className: 'text-center md:text-left' },
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
            createElement(
                'div',
                { className: 'ml-auto bg-waffle-orange/10 rounded-lg p-4 pulse-animation' },
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
                        { className: 'text-3xl font-bold text-waffle-brown' },
                        loyalty.points
                    ),
                    createElement(
                        'div',
                        { className: 'w-full bg-gray-200 rounded-full h-2.5 mt-2' },
                        createElement(
                            'div',
                            {
                                className: 'bg-waffle-orange h-2.5 rounded-full',
                                style: { width: `${loyalty.progress}%` }
                            }
                        )
                    ),
                    createElement(
                        'p',
                        { className: 'text-xs text-gray-600 mt-1' },
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
