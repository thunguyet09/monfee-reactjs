import React, { useContext, createContext, useState } from 'react';

const SearchContext = createContext();

const SearchContextProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const setSearchOpen = (isOpen) => {
    setOpen(isOpen);
  };

  return (
    <SearchContext.Provider value={{ open, setSearchOpen }}>
      {children}
    </SearchContext.Provider>
  );
};

const useSearch = () => useContext(SearchContext);
export { SearchContextProvider, useSearch};