import React, { useEffect, useState } from 'react'; 
import w_logo from '../assets/images/logos/Logo_w_mode.png';
import b_logo from '../assets/images/logos/Logo_b_mode.png';

function PageLoader() {

    // Obtener el logo según el modo de la aplicación	
    const [logo, setLogo] = useState(w_logo);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(darkMode);
        setLogo(darkMode ? b_logo : w_logo);
    }, []);

    // Cambiar el logo al cambiar el modo de la aplicación
    useEffect(() => {
        const handleChange = (e) => {
            setIsDarkMode(e.matches);
            setLogo(e.matches ? b_logo : w_logo);
        };
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', handleChange);
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return (
      <>
        <div className="dark:bg-neutral-900 bg-stone-100 h-screen flex flex-col justify-center items-center">
          <img
            src={logo}
            alt="Logo loader"
            className="loader-logo not-draggable w-48 transition-transform duration-500 ease-in-out animate-pulse"
          />
        </div>
      </>
    );
}

export default PageLoader;