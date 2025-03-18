const React = require('react');
const { createElement, useState, useEffect } = React;
const { db, auth } = require('../firebase');
const { collection, getDocs, addDoc, serverTimestamp } = require('firebase/firestore');

const FirestoreTest = () => {
    const [testResult, setTestResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [documents, setDocuments] = useState([]);
    
    // Test reading from Firestore
    const testRead = async () => {
        setIsLoading(true);
        setTestResult('');
        
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const docs = [];
            querySnapshot.forEach((doc) => {
                docs.push({ id: doc.id, ...doc.data() });
            });
            
            setDocuments(docs);
            setTestResult(`Successfully read ${docs.length} documents from Firestore`);
        } catch (error) {
            console.error('Error reading from Firestore:', error);
            setTestResult(`Error reading from Firestore: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Test writing to Firestore
    const testWrite = async () => {
        setIsLoading(true);
        setTestResult('');
        
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('You must be logged in to test write operations');
            }
            
            const testDoc = {
                createdBy: user.uid,
                displayName: user.displayName || 'Unknown User',
                email: user.email || 'No Email',
                createdAt: new Date().toISOString(),
                serverTimestamp: serverTimestamp(),
                testMessage: 'This is a test document',
            };
            
            const docRef = await addDoc(collection(db, 'test_documents'), testDoc);
            setTestResult(`Successfully wrote test document with ID: ${docRef.id}`);
        } catch (error) {
            console.error('Error writing to Firestore:', error);
            setTestResult(`Error writing to Firestore: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    return createElement(
        'div', 
        { className: 'bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mt-8' },
        createElement('h2', { className: 'text-2xl font-bold mb-4 text-waffle-brown' }, 'Firestore Connection Test'),
        
        createElement(
            'div',
            { className: 'flex space-x-4 mb-6' },
            createElement(
                'button',
                { 
                    className: `px-4 py-2 rounded-md ${isLoading ? 'bg-gray-400' : 'bg-waffle-orange hover:bg-waffle-orange-dark'} text-white font-medium`,
                    onClick: testRead,
                    disabled: isLoading
                },
                isLoading ? 'Testing...' : 'Test Read'
            ),
            createElement(
                'button',
                { 
                    className: `px-4 py-2 rounded-md ${isLoading ? 'bg-gray-400' : 'bg-waffle-orange hover:bg-waffle-orange-dark'} text-white font-medium`,
                    onClick: testWrite,
                    disabled: isLoading
                },
                isLoading ? 'Testing...' : 'Test Write'
            )
        ),
        
        testResult && createElement(
            'div',
            { className: `p-4 rounded-md mb-6 ${testResult.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}` },
            testResult
        ),
        
        documents.length > 0 && createElement(
            'div',
            { className: 'mt-6' },
            createElement('h3', { className: 'text-lg font-semibold mb-2 text-waffle-brown' }, 'Documents Found:'),
            createElement(
                'div',
                { className: 'bg-gray-50 p-4 rounded-md overflow-auto max-h-60' },
                documents.map(doc => createElement(
                    'div',
                    { key: doc.id, className: 'mb-3 p-2 border-b border-gray-200' },
                    createElement('p', { className: 'font-medium' }, `ID: ${doc.id}`),
                    createElement('p', null, `Display Name: ${doc.displayName || 'N/A'}`),
                    createElement('p', null, `Email: ${doc.email || 'N/A'}`),
                    createElement('p', null, `Updated: ${doc.updatedAt || 'N/A'}`)
                ))
            )
        )
    );
};

module.exports = { default: FirestoreTest };
