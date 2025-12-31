import { createContext, useContext, useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const FeatureFlagContext = createContext({});

export const useFeatureFlag = () => useContext(FeatureFlagContext);

export const FeatureFlagProvider = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  const [hideAdvancedFeatures, setHideAdvancedFeatures] = useState(true); // Default to true (basic mode)
  const [loading, setLoading] = useState(true);

  // Fetch feature flag from Firestore
  useEffect(() => {
    const fetchFeatureFlag = async () => {
      if (!currentUser) {
        setHideAdvancedFeatures(true); // Default for logged out users
        setLoading(false);
        return;
      }

      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          // Default to true if field doesn't exist (for existing users)
          setHideAdvancedFeatures(userData.hideAdvancedFeatures !== undefined ? userData.hideAdvancedFeatures : true);
        } else {
          // User document doesn't exist yet, default to true
          setHideAdvancedFeatures(true);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feature flag:', error);
        setHideAdvancedFeatures(true); // Default on error
        setLoading(false);
      }
    };

    fetchFeatureFlag();
  }, [currentUser]);

  // Update feature flag in Firestore (admin-only)
  const updateFeatureFlag = async (userId, value) => {
    if (!isAdmin) {
      throw new Error('Only administrators can update feature flags');
    }

    try {
      // Find user document by uid
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userDocRef = doc(db, 'users', userDoc.id);
        await updateDoc(userDocRef, {
          hideAdvancedFeatures: value
        });
        
        // Update local state if it's the current user
        if (userId === currentUser?.uid) {
          setHideAdvancedFeatures(value);
        }
        
        return { success: true };
      } else {
        throw new Error('User document not found');
      }
    } catch (error) {
      console.error('Error updating feature flag:', error);
      throw error;
    }
  };

  const value = {
    hideAdvancedFeatures,
    updateFeatureFlag,
    loading
  };

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

