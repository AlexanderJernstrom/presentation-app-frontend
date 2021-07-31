import { useState, useEffect } from "react";

export const useKeyPress = (targetKey: string) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);

  function downHandler(e: KeyboardEvent) {
    if (e.key === targetKey) {
      setIsPressed(true);
    }
  }
  // If released key is our target key then set to false
  const upHandler = (e: KeyboardEvent) => {
    if (e.key === targetKey) {
      setIsPressed(false);
    }
  };
  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  return isPressed;
};
