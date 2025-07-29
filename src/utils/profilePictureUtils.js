// 📁 src/utils/profilePictureUtils.js

// Compress image file before upload
export const compressImage = (file, maxWidth = 400, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const width = img.width * ratio;
      const height = img.height * ratio;
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Store profile picture URL (from server response)
export const storeProfilePictureUrl = (url) => {
  localStorage.setItem('userProfilePicUrl', url);
  localStorage.setItem('userProfilePicture', url);
};

// Store compressed profile picture locally
export const storeCompressedProfilePicture = async (file) => {
  try {
    const compressedFile = await compressImage(file);
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        const base64String = e.target.result;
        localStorage.setItem('userProfilePicture', base64String);
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(compressedFile);
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

// Get stored profile picture
export const getStoredProfilePicture = () => {
  return localStorage.getItem('userProfilePicture') || localStorage.getItem('userProfilePicUrl');
};

// Clear profile picture from storage
export const clearProfilePicture = () => {
  localStorage.removeItem('userProfilePicture');
  localStorage.removeItem('userProfilePicUrl');
};

// Validate image file
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
  }
  
  if (file.size > maxSize) {
    throw new Error('Image file size must be less than 5MB');
  }
  
  return true;
};

// Create a preview URL for selected image
export const createImagePreview = (file) => {
  return URL.createObjectURL(file);
};