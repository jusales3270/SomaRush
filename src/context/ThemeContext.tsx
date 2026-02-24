import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

export interface ThemeColors {
  // Backgrounds
  bgMain: string;
  bgSidebar: string;
  bgCard: string;
  bgCardHover: string;
  bgInput: string;
  bgTerminal: string;
  
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  
  // Borders
  border: string;
  borderLight: string;
  borderHover: string;
  
  // Accents (mantêm-se consistentes)
  cyan: string;
  purple: string;
  green: string;
  red: string;
  yellow: string;
  
  // Charts
  chartGrid: string;
  chartAxis: string;
  
  // Status
  statusOnline: string;
  statusOffline: string;
  
  // Gradients
  gradientPrimary: string;
  gradientButton: string;
}

export const themeColors: Record<Theme, ThemeColors> = {
  dark: {
    bgMain: 'bg-[#0B0E14]',
    bgSidebar: 'bg-[#1A1F2B]/40',
    bgCard: 'bg-[#1A1F2B]/60',
    bgCardHover: 'hover:bg-gray-800/50',
    bgInput: 'bg-black/50',
    bgTerminal: 'bg-black',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-300',
    textMuted: 'text-gray-500',
    textInverse: 'text-black',
    border: 'border-gray-800',
    borderLight: 'border-gray-700',
    borderHover: 'hover:border-gray-700',
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    chartGrid: '#232931',
    chartAxis: '#666',
    statusOnline: 'text-green-500',
    statusOffline: 'text-red-500',
    gradientPrimary: 'from-cyan-900/10 to-purple-900/10',
    gradientButton: 'from-cyan-600 via-purple-600 to-cyan-600',
  },
  light: {
    bgMain: 'bg-gray-50',
    bgSidebar: 'bg-white/80',
    bgCard: 'bg-white/90',
    bgCardHover: 'hover:bg-gray-100',
    bgInput: 'bg-white',
    bgTerminal: 'bg-gray-900',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-700',
    textMuted: 'text-gray-500',
    textInverse: 'text-white',
    border: 'border-gray-200',
    borderLight: 'border-gray-300',
    borderHover: 'hover:border-gray-400',
    cyan: 'text-cyan-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    chartGrid: '#e5e7eb',
    chartAxis: '#9ca3af',
    statusOnline: 'text-green-600',
    statusOffline: 'text-red-600',
    gradientPrimary: 'from-cyan-100 to-purple-100',
    gradientButton: 'from-cyan-500 via-purple-500 to-cyan-500',
  },
};

interface ThemeContextType {
    theme: Theme;
    colors: ThemeColors;
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
        document.body.className = theme === 'dark' ? 'bg-[#0B0E14]' : 'bg-gray-50';
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

    const colors = themeColors[theme];

    return (
        <ThemeContext.Provider value={{ theme, colors, sidebarCollapsed, toggleTheme, toggleSidebar }}>
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
