export const applyStoredTheme = () => {
    const storedTheme = localStorage.getItem('color-theme');
    if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

export const toggleTheme = () => {
    const currentTheme = localStorage.getItem('color-theme');
    if (currentTheme === 'dark') {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
    }
};

export const getTheme = () => {
    const storedTheme = localStorage.getItem('color-theme');
    if (storedTheme) return storedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: light)').matches;
};