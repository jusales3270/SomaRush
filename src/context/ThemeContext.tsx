import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    sidebarCollapsed: boolean;
    toggleTheme: () => void;
    toggleSidebar: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('soma_theme');
        return (saved as Theme) || 'dark';
    });

    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('soma_sidebar');
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('soma_theme', theme);
        document.body.className = theme; // Optional: helps with global resets
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('soma_sidebar', String(sidebarCollapsed));
    }, [sidebarCollapsed]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ theme, sidebarCollapsed, toggleTheme, toggleSidebar }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
