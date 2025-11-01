import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Check if a property is favorited by a user
 */
export const isPropertyFavorited = async (userId, propertyId) => {
  try {
    const favoritesQuery = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('propertyId', '==', propertyId)
    );
    const snapshot = await getDocs(favoritesQuery);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

/**
 * Get favorite ID for a property (returns null if not favorited)
 */
export const getFavoriteId = async (userId, propertyId) => {
  try {
    const favoritesQuery = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('propertyId', '==', propertyId)
    );
    const snapshot = await getDocs(favoritesQuery);
    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }
    return null;
  } catch (error) {
    console.error('Error getting favorite ID:', error);
    return null;
  }
};

/**
 * Add a property to favorites
 */
export const addToFavorites = async (userId, propertyId) => {
  try {
    // Check if already favorited
    const existing = await getFavoriteId(userId, propertyId);
    if (existing) {
      return { success: false, message: 'Already in favorites' };
    }

    const docRef = await addDoc(collection(db, 'favorites'), {
      userId: userId,
      propertyId: propertyId,
      createdAt: serverTimestamp()
    });

    return { success: true, favoriteId: docRef.id };
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Remove a property from favorites
 */
export const removeFromFavorites = async (favoriteId) => {
  try {
    await deleteDoc(doc(db, 'favorites', favoriteId));
    return { success: true };
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Toggle favorite status (add if not favorited, remove if favorited)
 */
export const toggleFavorite = async (userId, propertyId) => {
  try {
    const favoriteId = await getFavoriteId(userId, propertyId);
    
    if (favoriteId) {
      // Remove from favorites
      return await removeFromFavorites(favoriteId);
    } else {
      // Add to favorites
      return await addToFavorites(userId, propertyId);
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return { success: false, message: error.message };
  }
};

