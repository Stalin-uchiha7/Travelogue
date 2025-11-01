import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();
  const previousUserIdRef = useRef(null);

  // Clear search when user changes (login/logout)
  useEffect(() => {
    const currentUserId = currentUser?.uid || null;
    
    // If user changed (different user or logout/login), clear search
    if (previousUserIdRef.current !== null && previousUserIdRef.current !== currentUserId) {
      setSearchQuery('');
    }
    
    // Update the ref with current user ID
    previousUserIdRef.current = currentUserId;
  }, [currentUser]);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

