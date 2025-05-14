
import { useState } from 'react';

export const useDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);
  const toggleDrawer = () => setIsOpen(!isOpen);
  
  return {
    isOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer
  };
};
