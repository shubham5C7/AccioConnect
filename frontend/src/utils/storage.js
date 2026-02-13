import {DEFAULT_AVATAR} from '../constants'
// Key to store user in localStorage
export const USER_STORAGE_KEY = 'user';

// Save essential user data to localStorage
export const saveUserToStorage = (userData) => {
  // Save essential user data to localStorage
  try{
    const essentialData = {
       firstName: userData.firstName,
       lastName: userData.lastName,
      // Store null if no real profile picture
      profilePicture: userData.profilePicture && userData.profilePicture !== DEFAULT_AVATAR 
        ? userData.profilePicture 
        : null,
    };
    localStorage.setItem('user', JSON.stringify(essentialData));
  console.log("Saved to LS:", essentialData);
  }catch(err){
    console.log('Error saving user to localStorage',err)
  }
};

//Retrieve user data from localStorage Return null if nothing is stored
export const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem(USER_STORAGE_KEY);
    if (!user) return null;
    return JSON.parse(user);
  } catch (err) {
    console.error('Error reading user from localStorage:', err);
    return null;
  }
};
// Clear User data from localStorage used  for lodout
export const clearUserFromStorage = () => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing user from localStorage:', err);
  }
};

// Update profile picture only in localStorage
export const updateProfilePicture = (newUrl) => {
  try {
    const user = getUserFromStorage();
    if (user) {
      user.profilePicture = newUrl || DEFAULT_AVATAR;
      saveUserToStorage(user);
    }
  } catch (err) {
    console.error('Error updating profile picture:', err);
  }
};

// Get profile picture safely (returns default if missing)
export const getProfilePicture = () => {
  const user = getUserFromStorage();
  return user?.profilePicture || DEFAULT_AVATAR;
};


export const getUserFullName = () => {
  const user = getUserFromStorage();
  return `${user?.firstName || 'User'} ${user?.lastName || ''}`.trim();
};