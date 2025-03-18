const React = require('react');
const { createElement, useState, useEffect } = React;
const { auth, db, storage } = require('../firebase');
const { updateProfile, updateEmail } = require('firebase/auth');
const { doc, setDoc, getDoc, enableNetwork, disableNetwork, connectFirestoreEmulator } = require('firebase/firestore');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { useNavigate } = require('react-router-dom');

const EditProfile = () => {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
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
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        
        const user = auth.currentUser;
        if (!user) {
            setError('You must be logged in to update your profile');
            setIsLoading(false);
            return;
        }
        
        try {
            // First update Firebase Auth profile (this works offline)
            await updateProfile(user, { displayName });
            console.log('Display name updated successfully');
            
            // Only try to update email if online and email has changed
            if (navigator.onLine && email !== user.email) {
                try {
                    await updateEmail(user, email);
                    console.log('Email updated successfully');
                } catch (emailError) {
                    console.error('Error updating email:', emailError);
                    setError('Could not update email: ' + emailError.message);
                    setIsLoading(false);
                    return;
                }
            } else if (!navigator.onLine && email !== user.email) {
                setError('Cannot update email while offline. Please try again when you have an internet connection.');
                setIsLoading(false);
                return;
            }
            
            // Try to update Firestore data
            try {
                // Create user data object
                const userData = {
                    displayName,
                    email,
                    phoneNumber: phone,
                    updatedAt: new Date().toISOString(),
                    photoURL: auth.currentUser.photoURL // Use current photo URL as default
                };
                
                // Handle profile photo upload if a new file is selected
                const profilePhotoInput = document.getElementById('profile-photo');
                if (profilePhotoInput && profilePhotoInput.files.length > 0) {
                    const file = profilePhotoInput.files[0];
                    if (file) {
                        try {
                            console.log('Starting profile photo processing...');
                            console.log('Original file:', file.name, 'Size:', Math.round(file.size / 1024), 'KB', 'Type:', file.type);
                            
                            // Function to create a tiny data URL from an image file
                            const createTinyDataUrl = async (file, maxSize = 80, quality = 0.3) => {
                                return new Promise((resolve, reject) => {
                                    try {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            try {
                                                const img = new Image();
                                                img.onload = () => {
                                                    try {
                                                        console.log('Original dimensions:', img.width, 'x', img.height);
                                                        
                                                        // Calculate new dimensions while maintaining aspect ratio
                                                        let width = img.width;
                                                        let height = img.height;
                                                        const aspectRatio = width / height;
                                                        
                                                        if (aspectRatio > 1) {
                                                            // Landscape
                                                            width = maxSize;
                                                            height = Math.round(maxSize / aspectRatio);
                                                        } else {
                                                            // Portrait or square
                                                            height = maxSize;
                                                            width = Math.round(maxSize * aspectRatio);
                                                        }
                                                        
                                                        console.log('Tiny dimensions:', width, 'x', height);
                                                        
                                                        // Create canvas and resize
                                                        const canvas = document.createElement('canvas');
                                                        canvas.width = width;
                                                        canvas.height = height;
                                                        const ctx = canvas.getContext('2d');
                                                        ctx.fillStyle = '#FFFFFF'; // White background
                                                        ctx.fillRect(0, 0, width, height);
                                                        ctx.drawImage(img, 0, 0, width, height);
                                                        
                                                        // Get data URL with very low quality
                                                        const dataUrl = canvas.toDataURL('image/jpeg', quality);
                                                        console.log('Data URL length:', dataUrl.length, 'characters');
                                                        resolve(dataUrl);
                                                    } catch (canvasError) {
                                                        console.error('Canvas error:', canvasError);
                                                        reject(canvasError);
                                                    }
                                                };
                                                img.onerror = (imgError) => {
                                                    console.error('Image loading error:', imgError);
                                                    reject(new Error('Failed to load image'));
                                                };
                                                img.src = event.target.result;
                                            } catch (imgError) {
                                                console.error('Image creation error:', imgError);
                                                reject(imgError);
                                            }
                                        };
                                        reader.onerror = (readerError) => {
                                            console.error('FileReader error:', readerError);
                                            reject(readerError);
                                        };
                                        reader.readAsDataURL(file);
                                    } catch (error) {
                                        console.error('Data URL creation error:', error);
                                        reject(error);
                                    }
                                });
                            };
                            
                            try {
                                // Create a tiny data URL (80x80 pixels, 30% quality)
                                console.log('Creating tiny data URL...');
                                const dataUrl = await createTinyDataUrl(file);
                                console.log('Tiny data URL created successfully');
                                
                                // Store the data URL in Firestore only
                                userData.photoURL = dataUrl;
                                
                                // For Firebase Auth, use a default avatar URL instead of the data URL
                                // This avoids the 'URL too long' error
                                const defaultAvatarUrl = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                                console.log('Using default avatar URL for auth profile');
                                
                                // Update Firebase Auth profile with the default avatar URL
                                await updateProfile(auth.currentUser, {
                                    photoURL: defaultAvatarUrl
                                });
                                console.log('Auth profile updated with default avatar');
                                
                                // Note: The actual photo will be loaded from Firestore when needed
                                console.log('Photo will be loaded from Firestore when displayed');
                            } catch (error) {
                                console.error('Error processing profile photo:', error);
                                throw new Error(`Failed to process profile photo: ${error.message}`);
                            }
                        } catch (error) {
                            console.error('Error uploading profile photo:', error);
                            setError('Failed to upload profile photo: ' + error.message);
                            return;
                        }
                    }
                }
                
                // Reference to user document
                const userRef = doc(db, 'users', user.uid);
                
                // Skip Firestore operations if we're offline
                if (!navigator.onLine) {
                    throw new Error('offline');
                }
                
                // Import additional Firestore functions for better handling
                const { runTransaction, serverTimestamp } = require('firebase/firestore');
                
                // First try to use a transaction for more reliable updates
                try {
                    await runTransaction(db, async (transaction) => {
                        // Add server timestamp for better consistency
                        userData.serverUpdatedAt = serverTimestamp();
                        
                        // Check if document exists
                        const docSnapshot = await transaction.get(userRef);
                        
                        if (docSnapshot.exists()) {
                            // Update existing document
                            transaction.update(userRef, userData);
                            console.log('Transaction: Updating existing user document');
                        } else {
                            // Create new document
                            userData.createdAt = new Date().toISOString();
                            userData.serverCreatedAt = serverTimestamp();
                            transaction.set(userRef, userData);
                            console.log('Transaction: Creating new user document');
                        }
                    });
                    
                    console.log('Firestore transaction completed successfully');
                    setSuccessMessage('Profile updated successfully!');
                    setTimeout(() => navigate('/'), 1500);
                    return; // Exit early on success
                } catch (transactionError) {
                    console.warn('Transaction failed, falling back to direct setDoc:', transactionError);
                    // Continue to fallback method
                }
                
                // Fallback: Use direct setDoc with retries
                let retryCount = 0;
                const maxRetries = 3;
                let success = false;
                
                while (retryCount <= maxRetries && !success) {
                    try {
                        // Try with merge option to handle both new and existing documents
                        if (retryCount === 0) {
                            // First attempt: check if document exists
                            const docSnapshot = await getDoc(userRef);
                            if (!docSnapshot.exists()) {
                                userData.createdAt = new Date().toISOString();
                            }
                        }
                        
                        await setDoc(userRef, userData, { merge: true });
                        console.log(`Firestore document updated successfully on attempt ${retryCount + 1}`);
                        success = true;
                    } catch (retryError) {
                        console.warn(`Firestore update attempt ${retryCount + 1} failed:`, retryError);
                        retryCount++;
                        
                        // Exponential backoff for retries
                        if (retryCount <= maxRetries) {
                            const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 5000);
                            await new Promise(resolve => setTimeout(resolve, delay));
                        }
                    }
                }
                
                if (success) {
                    setSuccessMessage('Profile updated successfully!');
                    setTimeout(() => navigate('/'), 1500);
                } else {
                    throw new Error('Failed after multiple attempts');
                }
                
            } catch (firestoreError) {
                console.error('Firestore error:', firestoreError);
                
                // Check for specific Firestore error codes
                const errorCode = firestoreError.code || '';
                const errorMessage = firestoreError.message || '';
                
                // Log detailed error information for debugging
                console.error('Firestore error details:', {
                    code: errorCode,
                    message: errorMessage,
                    offline: !navigator.onLine
                });
                
                // Store the update in localStorage for later sync
                try {
                    const pendingUpdates = JSON.parse(localStorage.getItem('pendingProfileUpdates') || '[]');
                    pendingUpdates.push({
                        uid: user.uid,
                        displayName,
                        email,
                        phoneNumber: phone,
                        timestamp: new Date().toISOString(),
                        errorDetails: {
                            code: errorCode,
                            message: errorMessage
                        }
                    });
                    localStorage.setItem('pendingProfileUpdates', JSON.stringify(pendingUpdates));
                    console.log('Saved update to localStorage for later sync');
                } catch (localStorageError) {
                    console.error('Failed to save to localStorage:', localStorageError);
                }
                
                // Determine appropriate user message based on error type
                if (!navigator.onLine || 
                    errorMessage === 'offline' || 
                    errorCode === 'failed-precondition' || 
                    errorCode === 'unavailable' ||
                    errorMessage.includes('offline') || 
                    errorMessage.includes('network')) {
                    // Offline or network-related error
                    setSuccessMessage('Profile name updated successfully. Other data will sync when you are back online.');
                } else if (errorCode === 'permission-denied') {
                    // Permission issue
                    setError('You do not have permission to update this profile. Only the profile owner can make changes.');
                    setIsLoading(false);
                    return;
                } else if (errorCode === 'resource-exhausted') {
                    // Rate limiting or quota issue
                    setSuccessMessage('Profile partially updated. Server is busy, please try again later.');
                } else {
                    // Other errors
                    setSuccessMessage('Profile partially updated. Some data may not have been saved to the server.');
                }
                
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
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
                    id: 'profile-photo',
                    accept: 'image/*',
                    onChange: handlePhotoChange,
                    className: 'w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-waffle-orange transition-all'
                })
            ),
            createElement('div', { className: 'flex space-x-2' },
                createElement('button', { 
                    type: 'submit', 
                    disabled: isLoading,
                    className: `bg-waffle-brown text-white px-4 py-2 rounded hover:bg-opacity-80 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}` 
                }, 
                    isLoading ? 
                        createElement('div', { className: 'flex items-center justify-center' },
                            createElement('svg', { 
                                className: 'animate-spin -ml-1 mr-3 h-5 w-5 text-white', 
                                xmlns: 'http://www.w3.org/2000/svg', 
                                fill: 'none', 
                                viewBox: '0 0 24 24' 
                            },
                                createElement('circle', { 
                                    className: 'opacity-25', 
                                    cx: '12', 
                                    cy: '12', 
                                    r: '10', 
                                    stroke: 'currentColor', 
                                    strokeWidth: '4' 
                                }),
                                createElement('path', { 
                                    className: 'opacity-75', 
                                    fill: 'currentColor', 
                                    d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' 
                                })
                            ),
                            'Saving...'
                        ) : 'Save'
                ),
                createElement('button', { 
                    type: 'button', 
                    onClick: () => navigate('/'), 
                    disabled: isLoading,
                    className: `bg-waffle-brown text-white px-4 py-2 rounded hover:bg-opacity-80 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}` 
                }, 'Back to Landing Page')
            ),
            error && createElement('p', { className: 'error-message mt-4', style: { color: 'red' } }, error),
            successMessage && createElement('p', { className: 'success-message mt-4', style: { color: 'green' } }, successMessage)
        )
    );
};

module.exports = { default: EditProfile };
