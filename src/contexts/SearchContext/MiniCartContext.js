import React, { useContext, createContext, useState } from 'react';

const MiniCartContext = createContext();

const MiniCartContextProvider = ({ children }) => {
  const [openMiniCart, setOpen] = useState(false);

  const setMiniCartOpen = (isOpen) => {
    setOpen(isOpen);
  };

  return (
    <MiniCartContext.Provider value={{ openMiniCart, setMiniCartOpen }}>
      {children}
    </MiniCartContext.Provider>
  );
};

const useMiniCart = () => useContext(MiniCartContext);
export { MiniCartContextProvider, useMiniCart};