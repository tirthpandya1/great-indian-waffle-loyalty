const React = require('react');
const { createElement, useState, useEffect } = React;
const { auth } = require('../firebase');

const EditProfile = () => {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setDisplayName(user.displayName || '');
            setEmail(user.email || '');
        }
    }, []);

    const handleSave = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                await user.updateProfile({ displayName });
                // Optionally update email if needed
                // await user.updateEmail(email);
                alert('Profile updated successfully!');
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return createElement(
        'div',
        { className: 'edit-profile-container' },
        createElement(
            'h2',
            null,
            'Edit Profile'
        ),
        createElement(
            'input',
            {
                type: 'text',
                value: displayName,
                onChange: (e) => setDisplayName(e.target.value),
                placeholder: 'Display Name'
            }
        ),
        createElement(
            'input',
            {
                type: 'email',
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: 'Email'
            }
        ),
        createElement(
            'button',
            {
                onClick: handleSave,
                className: 'save-button'
            },
            'Save'
        ),
        error && createElement('p', { className: 'error-message' }, error)
    );
};

module.exports = { default: EditProfile };
