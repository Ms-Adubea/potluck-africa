// 📁 src/utils/profilePictureUtils.js

/**
 * Utility functions for managing profile pictures in PWA
 */

// Convert file to base64 string for localStorage storage
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Store profile picture in localStorage
export const storeProfilePicture = async (file) => {
  try {
    if (!file) return null;
    
    const base64String = await fileToBase64(file);
    localStorage.setItem('userProfilePicture', base64String);
    return base64String;
  } catch (error) {
    console.error('Error storing profile picture:', error);
    return null;
  }
};

// Store profile picture URL (if coming from server)
export const storeProfilePictureUrl = (url) => {
  if (url) {
    localStorage.setItem('userProfilePicUrl', url);
  }
};

// Get stored profile picture
export const getStoredProfilePicture = () => {
  return localStorage.getItem('userProfilePicture') || localStorage.getItem('userProfilePicUrl');
};

// Remove stored profile picture
export const removeStoredProfilePicture = () => {
  localStorage.removeItem('userProfilePicture');
  localStorage.removeItem('userProfilePicUrl');
};

// Compress image before storing (optional, for better performance)
export const compressImage = (file, maxWidth = 200, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Store compressed profile picture
export const storeCompressedProfilePicture = async (file) => {
  try {
    if (!file) return null;
    
    const compressedFile = await compressImage(file);
    const base64String = await fileToBase64(compressedFile);
    localStorage.setItem('userProfilePicture', base64String);
    return base64String;
  } catch (error) {
    console.error('Error storing compressed profile picture:', error);
    return null;
  }
};