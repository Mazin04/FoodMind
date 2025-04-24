import { useEffect, useState } from 'react';
import '../styles/App.css';
import { useTranslation } from 'react-i18next';
import "@theme-toggles/react/css/DarkInner.css"
import { DarkInner } from '@theme-toggles/react';
import { toggleTheme, applyStoredTheme, getTheme } from '@/lib/theme';
import { FaGoogle } from 'react-icons/fa';

import w_logo from '../assets/images/logos/Logo_w_mode.png';
import b_logo from '../assets/images/logos/Logo_b_mode.png';
import LanguageSelect from '../components/LanguageSelect';

function App() {

  // Usar useTranslation para manejar la traducción
  const { t, i18n } = useTranslation();
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    applyStoredTheme();
    setIsDarkMode(getTheme());
  }, []);

  const toggleMode = () => {
    toggleTheme();
    setIsDarkMode(getTheme());
  };

  return (
    <>
      <div className='dark:bg-neutral-900 bg-stone-100 min-h-screen flex flex-row justify-center items-center'>
        <div className='dark:bg-zinc-800 bg-blue-50 w-[50%] min-h-screen backdrop-blur-2xl br-3xl'>
          <img src={getTheme() ? b_logo : w_logo} alt="Logo" className='w-[50%] h-auto mx-auto mt-10' />
        </div>
        <div className='dark:bg-neutral-900 bg-blue-100 w-[50%] min-h-screen flex flex-col justify-center items-center relative'>
          <button className='absolute dark:text-white top-7 right-50'>{t('change_login')}</button>
          <div className='absolute top-5 right-5'><LanguageSelect/></div>

          <div id='form' className='flex flex-col justify-center items-center w-[35%]'>
            <h1 className='text-3xl font-bold text-center dark:text-white text-neutral-900'>{t('welcome_register')}</h1>
            <h1 className='text-3xl font-bold text-center dark:text-white text-neutral-900'>{t('example1')}</h1>
            <p className='text-lg text-center dark:text-white text-neutral-900'>{t('enter_to_create')}</p>

            <input type='email' placeholder={t('input_email')} className='dark:bg-neutral-800 bg-blue-50 dark:text-white text-neutral-900 p-2 rounded-lg mt-4 w-full' />
            <input type='password' placeholder={t('input_password')} className='dark:bg-neutral-800 bg-blue-50 dark:text-white text-neutral-900 p-2 rounded-lg mt-4 w-full hidden' />
            <button className='bg-blue-500 text-white p-2 rounded-lg mt-4 w-full hover:bg-blue-600'>{t('register')}</button>
            <div className='flex flex-row items-center mt-4 w-full'>
              <hr className='flex-grow border-t border-2 dark:border-zinc-600 border-white' />
              <p className='text-sm text-center dark:text-white text-neutral-900 mx-4'>{t('OR')}</p>
              <hr className='flex-grow border-t border-2 dark:border-zinc-600 border-white' />
            </div>
            <div className='w-full flex flex-row justify-center items-center mt-4 dark:bg-neutral-800 bg-blue-50 p-2 rounded-lg cursor-pointer hover:bg-blue-200 group'>
              <FaGoogle className='text-2xl text-blue-500' />
              <p className='text-sm text-center dark:text-white text-neutral-900 dark:group-hover:text-black group-hover:text-blue-500 ml-2'>{t('login_google')}</p>
            </div>
          </div>
          <DarkInner className='dark:text-white text-neutral-900 text-[200px]' duration={500} onToggle={toggleMode}></DarkInner>
        </div>
      </div>
    </>
  );
}

export default App;
