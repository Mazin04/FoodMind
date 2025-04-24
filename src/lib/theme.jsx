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
    if (currentTheme === 'light') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
    }
};

export const getTheme = () => {
    const storedTheme = localStorage.getItem('color-theme');
    if (storedTheme) return storedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};