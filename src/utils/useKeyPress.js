import { useEffect, useState } from 'react';

export const useKeyPress = (targetKey, fn) => {
    function downHandler({ key }) {
      if (key === targetKey) {
        fn();
      }
    }
  
    useEffect(() => {
      window.addEventListener('keydown', downHandler);
      return () => {
        window.removeEventListener('keydown', downHandler);
      };
    }, []);
  };
  