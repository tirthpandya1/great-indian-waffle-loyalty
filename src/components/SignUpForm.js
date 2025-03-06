const React = require('react');
const { useState, createElement } = React;
const generateQRCode = require('../utils/qrCodeGenerator').default;

const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = `Email: ${email}, Phone: ${phone}`;
            const qrCodeDataURL = await generateQRCode(data);
            setQrCode(qrCodeDataURL);
            setIsSuccess(true);
            // Here you can also add logic to send the data to your backend
        } catch (error) {
            console.error('Error generating QR code:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return createElement(
        'div', 
        { className: 'w-full' },
        createElement(
            'h2', 
            { className: 'text-2xl font-semibold text-waffle-brown mb-6 text-center' }, 
            'Join Our Loyalty Program'
        ),
        !isSuccess ? createElement(
            'form', 
            { onSubmit: handleSubmit, className: 'space-y-6' },
            createElement(
                'div', 
                { className: 'space-y-2' },
                createElement(
                    'label', 
                    { className: 'block text-waffle-brown font-medium', htmlFor: 'email' }, 
                    'Email Address'
                ),
                createElement('input', {
                    type: 'email',
                    id: 'email',
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    required: true,
                    placeholder: 'your@email.com',
                    className: 'w-full px-4 py-3 rounded-lg border border-gray-300 sign-up-form__input focus:ring-2 focus:ring-waffle-orange transition-all'
                })
            ),
            createElement(
                'div', 
                { className: 'space-y-2' },
                createElement(
                    'label', 
                    { className: 'block text-waffle-brown font-medium', htmlFor: 'phone' }, 
                    'Phone Number'
                ),
                createElement('input', {
                    type: 'tel',
                    id: 'phone',
                    value: phone,
                    onChange: (e) => setPhone(e.target.value),
                    required: true,
                    placeholder: 'Your mobile number',
                    className: 'w-full px-4 py-3 rounded-lg border border-gray-300 sign-up-form__input focus:ring-2 focus:ring-waffle-orange transition-all'
                })
            ),
            createElement(
                'button', 
                { 
                    type: 'submit', 
                    disabled: isSubmitting,
                    className: `w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-waffle-brown hover:bg-waffle-red'}` 
                }, 
                isSubmitting ? 'Generating...' : 'Generate My Loyalty QR Code'
            )
        ) : null,
        qrCode && createElement(
            'div', 
            { className: 'mt-8 flex flex-col items-center' },
            createElement(
                'div',
                { className: 'text-center mb-4' },
                createElement(
                    'h3',
                    { className: 'text-xl font-semibold text-waffle-brown mb-2' },
                    'Your Loyalty QR Code is Ready!'
                ),
                createElement(
                    'p',
                    { className: 'text-gray-600' },
                    'Show this QR code when you visit us to earn and redeem points.'
                )
            ),
            createElement(
                'div',
                { className: 'bg-white p-4 rounded-lg shadow-md border-2 border-waffle-orange waffle-pattern' },
                createElement('img', { 
                    src: qrCode, 
                    alt: 'QR Code', 
                    className: 'w-48 h-48 mx-auto' 
                })
            ),
            createElement(
                'button',
                { 
                    onClick: () => {
                        setQrCode('');
                        setIsSuccess(false);
                        setEmail('');
                        setPhone('');
                    },
                    className: 'mt-6 py-2 px-4 rounded-lg font-medium text-waffle-brown border border-waffle-brown hover:bg-waffle-brown hover:text-white transition-all'
                },
                'Generate Another Code'
            )
        )
    );
};

module.exports = { default: SignUpForm };
