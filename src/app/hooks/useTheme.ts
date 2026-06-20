import { useState, useEffect } from 'react';

/**
 * Custom hook for managing theme state globally across the application.
 * Handles localStorage persistence and system preference detection.
 * 
 * @returns {Object} Theme state and toggle function
 * @returns {boolean} isDarkMode - Current theme mode
 * @returns {Function} toggleTheme - Function to switch between light and dark modes
 */
export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    setIsDarkMode(isDark);
    applyTheme(isDark);
    setIsInitialized(true);
  }, []);

  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      applyTheme(newMode);
      return newMode;
    });
  };

  return { isDarkMode, toggleTheme, isInitialized };
}
