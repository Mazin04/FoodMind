import { useEffect, useState } from 'react';
import '../styles/App.css';
import { useTranslation } from 'react-i18next';
import "@theme-toggles/react/css/DarkInner.css";
import { DarkInner } from '@theme-toggles/react';
import { toggleTheme, applyStoredTheme, getTheme } from '@/lib/theme';
import { FaGoogle } from 'react-icons/fa';
import Typewriter from 'typewriter-effect';

import w_logo from '../assets/images/logos/Logo_w_mode.png';
import b_logo from '../assets/images/logos/Logo_b_mode.png';
import LanguageSelect from '../components/LanguageSelect';

function App() {
  const { t } = useTranslation();

  const [, setIsDarkMode] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);

  useEffect(() => {
    applyStoredTheme();
    setIsDarkMode(getTheme());
  }, []);

  const toggleMode = () => {
    toggleTheme();
    setIsDarkMode(getTheme());
  };

  const changeSignMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <>
      <div className='dark:bg-neutral-900 bg-stone-100 min-h-screen flex flex-row justify-center items-center'>
        {/* Panel izquierdo */}
        <div className='hidden xl:flex dark:bg-zinc-800 bg-blue-50 w-[50%] min-h-screen backdrop-blur-2xl br-3xl flex-col justify-center items-center relative'>
          <div className='absolute top-5 left-10 flex flex-row items-center'>
            <img src={getTheme() ? b_logo : w_logo} alt="Logo" className='w-[80px] h-auto' />
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
          <img src={getTheme() ? b_logo : w_logo} alt="Logo" className='w-[30%] h-auto mx-auto mt-10 loader-logo' />
        </div>

        {/* Panel derecho */}
        <div className='dark:bg-neutral-900 bg-blue-100 w-full xl:w-[50%] min-h-screen flex flex-col justify-center items-center relative'>

          {/* Logo y menú en parte superior pantalla pequeña */}
          <div className='xl:hidden flex flex-row items-center justify-between dark:bg-zinc-800 bg-blue-50 w-full absolute top-0 left-0 px-4 py-2'>
            <img src={getTheme() ? b_logo : w_logo} alt="Logo" className='w-[80px] h-auto' />

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
            onToggle={toggleMode}
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
          <div className={`flex flex-col justify-center items-center w-full sm:w-[70%] md:w-[50%] xl:w-[50%] ${isLoginMode ? 'sign-in-mode' : 'sign-up-mode'}`}>
            <h1 className='text-3xl font-bold text-center dark:text-white text-neutral-900'>
              {isLoginMode ? t('welcome_back') : t('welcome_register')}
            </h1>
            <p className='text-lg text-center dark:text-white text-neutral-900 mt-3 mb-4'>
              {isLoginMode ? t('enter_to_continue') : t('enter_to_create')}
            </p>

            <div className='w-[70%] flex flex-col justify-center items-center'>
              <form className='flex flex-col justify-center items-center w-full'>
                {!isLoginMode && (
                  <input
                    id='input_name'
                    type='text'
                    placeholder={t('input_name')}
                    className='dark:bg-neutral-800 bg-blue-50 dark:text-white text-neutral-900 p-2 rounded-lg mt-4 w-full'
                  />
                )}
                <input
                  id='input_email'
                  type='email'
                  placeholder={t('input_email')}
                  className='dark:bg-neutral-800 bg-blue-50 dark:text-white text-neutral-900 p-2 rounded-lg mt-4 w-full'
                />
                {isLoginMode && (
                  <input
                    id='input_password'
                    type='password'
                    placeholder={t('input_password')}
                    className='dark:bg-neutral-800 bg-blue-50 dark:text-white text-neutral-900 p-2 rounded-lg mt-4 w-full'
                  />
                )}
                <p id='error_message' className='text-red-500 text-sm mt-2 hidden'>
                  {/* Error message */}
                </p>
                <button
                  id='button_sign'
                  className='bg-blue-500 text-white p-2 rounded-lg mt-4 w-full hover:bg-blue-600'
                >
                  {isLoginMode ? t('login') : t('register')}
                </button>
              </form>

              {/* Línea divisoria y login con Google */}
              <div className='flex flex-row items-center mt-4 w-full'>
                <hr className='flex-grow border-t border-2 dark:border-zinc-600 border-white' />
                <p className='text-sm text-center dark:text-white text-neutral-900 mx-4'>{t('OR')}</p>
                <hr className='flex-grow border-t border-2 dark:border-zinc-600 border-white' />
              </div>
              <div
                className='w-full flex flex-row justify-center items-center mt-4 dark:bg-neutral-800 bg-blue-50 p-2 rounded-lg cursor-pointer hover:bg-blue-200 group'
                onClick={() => window.open('http://localhost:8000/auth/google/redirect', '_self')}
              >
                <FaGoogle className='text-2xl text-blue-500' />
                <p className='text-sm text-center dark:text-white text-neutral-900 dark:group-hover:text-black group-hover:text-blue-500 ml-2'>
                  {t('login_google')}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default App;
