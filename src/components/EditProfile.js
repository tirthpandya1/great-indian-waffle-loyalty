const React = require('react');
const { createElement, useState, useEffect } = React;
const { auth } = require('../firebase');
const { useNavigate } = require('react-router-dom');

const EditProfile = () => {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setDisplayName(user.displayName || '');
            setEmail(user.email || '');
            setPhone(user.phoneNumber || '');
        }
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (user) {
            try {
                await user.updateProfile({ displayName });
                await user.updateEmail(email);
                if (phone) {
                    // Assuming you have a method to update the phone number in your database
                    await updatePhoneNumber(user, phone);
                }
                navigate('/');
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handlePhotoChange = (e) => {
        // Assuming you have a method to update the profile photo in your database
        // updateProfilePhoto(user, e.target.files[0]);
    };

    return createElement('div', { className: 'w-full' },
        createElement('h2', { className: 'text-2xl font-semibold text-waffle-brown mb-6 text-center' }, 'Edit Your Profile'),
        createElement('form', { onSubmit: handleSave, className: 'space-y-6' },
            createElement('div', { className: 'space-y-2' },
                createElement('label', { className: 'block text-waffle-brown font-medium', htmlFor: 'displayName' }, 'Display Name'),
                createElement('input', {
                    type: 'text',
                    id: 'displayName',
                    value: displayName,
                    onChange: (e) => setDisplayName(e.target.value),
                    placeholder: 'Your Name',
                    className: 'w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-waffle-orange transition-all'
                })
            ),
            createElement('div', { className: 'space-y-2' },
                createElement('label', { className: 'block text-waffle-brown font-medium', htmlFor: 'email' }, 'Email'),
                createElement('input', {
                    type: 'email',
                    id: 'email',
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    placeholder: 'your@email.com',
                    className: 'w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-waffle-orange transition-all'
                })
            ),
            createElement('div', { className: 'space-y-2' },
                createElement('label', { className: 'block text-waffle-brown font-medium', htmlFor: 'phone' }, 'Mobile Number'),
                createElement('input', {
                    type: 'tel',
                    id: 'phone',
                    value: phone,
                    onChange: (e) => setPhone(e.target.value),
                    placeholder: 'Your Mobile Number',
                    className: 'w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-waffle-orange transition-all'
                })
            ),
            createElement('div', { className: 'space-y-2' },
                createElement('label', { className: 'block text-waffle-brown font-medium', htmlFor: 'profilePhoto' }, 'Profile Photo'),
                createElement('input', {
                    type: 'file',
                    id: 'profilePhoto',
                    accept: 'image/*',
                    onChange: handlePhotoChange,
                    className: 'w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-waffle-orange transition-all'
                })
            ),
            createElement('button', { type: 'submit', className: 'bg-waffle-brown text-white px-4 py-2 rounded hover:bg-opacity-80' }, 'Save'),
            createElement('button', { type: 'button', onClick: () => navigate('/'), className: 'bg-waffle-brown text-white px-4 py-2 rounded hover:bg-opacity-80' }, 'Back to Landing Page'),
            error && createElement('p', { className: 'error-message', style: { color: 'red' } }, error)
        )
    );
};

module.exports = { default: EditProfile };
