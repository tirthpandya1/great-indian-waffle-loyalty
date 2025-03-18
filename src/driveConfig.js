// Google Drive configuration for image uploads
const { google } = require('googleapis');

// These credentials should be stored in environment variables in production
const credentials = {
  client_id: 'YOUR_CLIENT_ID', // Replace with your OAuth client ID
  client_secret: 'YOUR_CLIENT_SECRET', // Replace with your OAuth client secret
  redirect_uri: 'http://localhost:3000/auth/google/callback' // Your redirect URI
};

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  credentials.client_id,
  credentials.client_secret,
  credentials.redirect_uri
);

// Create Drive client
const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

// Function to upload image to Google Drive
const uploadImageToDrive = async (file, userId) => {
  // For browser-based uploads, we need a simpler approach
  // that doesn't require server-side OAuth flow
  
  // Create a form for the direct upload API
  const formData = new FormData();
  
  // Add metadata
  const metadata = {
    name: `profile-photo-${userId}-${Date.now()}`,
    mimeType: file.type,
    parents: ['YOUR_FOLDER_ID'] // Replace with your Google Drive folder ID for storing profile photos
  };
  
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  formData.append('file', file);
  
  // Get the user's access token (this would need to be obtained through OAuth flow)
  // For this example, we'll assume it's stored in localStorage after user login
  const accessToken = localStorage.getItem('google_access_token');
  
  if (!accessToken) {
    throw new Error('Google Drive access token not found. User may need to authenticate with Google.');
  }
  
  try {
    // Upload directly to Google Drive API
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Google Drive upload failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Make the file publicly accessible
    await fetch(`https://www.googleapis.com/drive/v3/files/${data.id}/permissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone'
      })
    });
    
    // Return the public URL
    return `https://drive.google.com/uc?export=view&id=${data.id}`;
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
};

// Function to get Google Auth URL for user login
const getGoogleAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/drive.file' // For file uploads only
  ];
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true
  });
};

// Function to get tokens from code (after user authorizes)
const getTokensFromCode = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

module.exports = {
  drive,
  oauth2Client,
  uploadImageToDrive,
  getGoogleAuthUrl,
  getTokensFromCode
};
