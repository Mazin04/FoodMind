import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import { DarkInner } from '@theme-toggles/react';

import '@/styles/App.css';
import "@theme-toggles/react/css/DarkInner.css";

import { useTheme } from '@/context/ThemeContext';
import LanguageSelect from '@/components/LanguageSelect';
import AuthForm from '@/components/AuthForm';

import w_logo from '@/assets/images/logos/Logo_w_mode.png';
import b_logo from '@/assets/images/logos/Logo_b_mode.png';

function App() {
  const { t } = useTranslation();

  const { isDarkMode, toggleTheme } = useTheme();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const changeSignMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <>
      <div className='dark:bg-neutral-900 bg-stone-100 min-h-screen flex flex-row justify-center items-center'>
        <div className='hidden xl:flex dark:bg-zinc-800 bg-blue-50 w-[50%] min-h-screen backdrop-blur-2xl br-3xl flex-col justify-center items-center relative'>
          <div className='absolute top-5 left-10 flex flex-row items-center'>
            <img key={isDarkMode ? 'dark-logo' : 'light-logo'} src={isDarkMode ? b_logo : w_logo} alt="Logo" className='w-[80px] h-auto' />
            <p className='text-2xl font-bold text-neutral-900 dark:text-white'>FoodMind</p>
          </div>
          <div className='absolute bottom-5 left-10 flex flex-row items-center'>
            <Typewriter
              options={{
                strings: [t('slogan_1'), t('slogan_2'), t('slogan_3'), t('slogan_4')],
                autoStart: true,
                pauseFor: 2000,
                delay: 45,
                wrapperClassName: 'text-lg sm:text-xl font-bold text-neutral-900 dark:text-white overflow-hidden text-ellipsis w-full',
                cursorClassName: 'text-lg sm:text-xl dark:text-white text-neutral-900',
                loop: true,
                deleteSpeed: 50,
                cursor: '|',
              }}
            />
          </div>
          <img key={isDarkMode ? 'dark-logo' : 'light-logo'} src={isDarkMode ? b_logo : w_logo} alt="Logo" className='w-[30%] h-auto mx-auto mt-10 loader-logo' />
        </div>

        {/* Panel derecho */}
        <div className='dark:bg-neutral-900 bg-blue-100 w-full xl:w-[50%] min-h-screen flex flex-col justify-center items-center relative'>

          {/* Logo y menú en parte superior pantalla pequeña */}
          <div className='xl:hidden flex flex-row items-center justify-between dark:bg-zinc-800 bg-blue-50 w-full absolute top-0 left-0 px-4 py-2'>
            <img key={isDarkMode ? 'dark-logo' : 'light-logo'} src={isDarkMode ? b_logo : w_logo} alt="Logo" className='w-[80px] h-auto' />

            <div className='flex flex-row items-center space-x-10'>
              <button
                id='mode_change_button'
                className='dark:text-white text-neutral-900'
                onClick={changeSignMode}
              >
                {isLoginMode ? t('change_register') : t('change_login')}
              </button>
              <LanguageSelect />
            </div>
          </div>

          <button
            id='mode_change_button'
            className='hidden xl:block absolute dark:text-white top-7 right-55'
            onClick={changeSignMode}>
            {isLoginMode ? t('change_register') : t('change_login')}
          </button>

          <div className='hidden xl:block absolute top-5 right-10'>
            <LanguageSelect />
          </div>

          <DarkInner
            className='absolute bottom-5 right-5 dark:text-white text-neutral-900 text-3xl sm:text-[35px] 2xl:text-[50px]'
            duration={500}
            onToggle={toggleTheme}
          />

          <div className='absolute bottom-5 left-5 xl:hidden flex flex-row items-center w-[300px] sm:w-fit'>
            <Typewriter
              options={{
                strings: [t('slogan_1'), t('slogan_2'), t('slogan_3'), t('slogan_4')],
                autoStart: true,
                pauseFor: 2000,
                delay: 45,
                wrapperClassName: 'text-lg sm:text-xl font-bold text-neutral-900 dark:text-white overflow-hidden text-ellipsis w-full',
                cursorClassName: 'text-lg sm:text-xl dark:text-white text-neutral-900',
                loop: true,
                deleteSpeed: 50,
                cursor: '|',
              }}
            />
          </div>

          {/* Pantalla general */}
          <div className={`flex flex-col justify-center items-center w-full sm:w-[70%] md:w-[50%] xl:w-[60%] 2xl:w-[50%] ${isLoginMode ? 'sign-in-mode' : 'sign-up-mode'}`}>

            <motion.h1
              key={isLoginMode ? 'login_title' : 'register_title'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className='text-3xl font-bold text-center dark:text-white text-neutral-900'
            >
              {isLoginMode ? t('welcome_back') : t('welcome_register')}
            </motion.h1>

            <motion.p
              key={isLoginMode ? 'login_subtitle' : 'register_subtitle'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className='text-lg text-center dark:text-white text-neutral-900 mt-3 mb-2'
            >
              {isLoginMode ? t('enter_to_continue') : t('enter_to_create')}
            </motion.p>

            <AuthForm isLoginMode={isLoginMode} isDarkMode={isDarkMode} />
          </div>

        </div>
      </div>
    </>
  );
}

export default App;
