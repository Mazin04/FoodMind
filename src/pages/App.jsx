import { useEffect, useState } from 'react';
import '../styles/App.css';
import { useTranslation } from 'react-i18next';
import "@theme-toggles/react/css/DarkInner.css";
import { DarkInner } from '@theme-toggles/react';
import { toggleTheme, applyStoredTheme, getTheme } from '@/lib/theme';
import { FaGoogle } from 'react-icons/fa';
import Typewriter from 'typewriter-effect';
import { motion, AnimatePresence } from 'framer-motion';

import w_logo from '../assets/images/logos/Logo_w_mode.png';
import b_logo from '../assets/images/logos/Logo_b_mode.png';
import LanguageSelect from '../components/LanguageSelect';
import { InputText } from 'primereact/inputtext';
import { isEmailRegistered, registerUser, login as loginService, getUser } from '../services/authService';

function App() {
  const { t } = useTranslation();

  const [, setIsDarkMode] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [registerPassword, setRegisterPassword] = useState(false); // State to control password visibility
  const shouldShowPassword = isLoginMode || (registerPassword && !isLoginMode);
  const [showPassword, setShowPassword] = useState(false); // State to control password visibility

  const error_message = document.getElementById('error_message');

  // Variables para el registro
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  var isEmailValid = false;

  useEffect(() => {
    applyStoredTheme();
    setIsDarkMode(getTheme());
    setRegisterPassword(true);
  }, []);


  const toggleMode = () => {
    toggleTheme();
    setIsDarkMode(getTheme());
  };

  const changeSignMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
    setRegisterPassword(false);
  };

  const handleEmailChange = (e) => {
    const input = e.target.value;
    error_message.classList.add('hidden');
    setEmail(input);
    setRegisterPassword(false);
  }

  const doRegister = async (e) => {
    e.preventDefault();
    // Comprobar que el nombre no está vacío
    if (name.trim() === '') {
      error_message.classList.remove('hidden');
      error_message.innerHTML = t('error_empty_name');
      return;
    }

    // Comprobar que el correo electrónico no está vacío
    if (email.trim() === '') {
      error_message.classList.remove('hidden');
      error_message.innerHTML = t('error_empty_email');
      return;
    }

    // Comprobar que el correo electrónico tiene un formato válido
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      error_message.classList.remove('hidden');
      error_message.innerHTML = t('error_invalid_email');
      return;
    }
    // Comprobar que el correo electrónico no está registrado
    isEmailValid = await isEmailRegistered(email);

    if (isEmailValid.registered && !shouldShowPassword) {
      error_message.classList.remove('hidden');
      error_message.innerHTML = t('error_email_registered');
    } else if (!isEmailValid.registered && shouldShowPassword) {
      // Comprobar que la contraseña no está vacía
      if (password.trim() === '') {
        error_message.classList.remove('hidden');
        error_message.innerHTML = t('error_empty_password');
        return;
      }
      // Comprobar que la contraseña tiene al menos 8 caracteres y contiene al menos una letra y un número
      const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (!passwordPattern.test(password)) {
        error_message.classList.remove('hidden');
        error_message.innerHTML = t('error_invalid_password');
        return;
      }
      // Aquí puedes realizar la lógica de registro, como enviar los datos al servidor
      try {
        const user = await registerUser(name, email, password);
        console.log(user);
        error_message.classList.remove('hidden');
        error_message.innerHTML = t('register_success');
      } catch (error) {
        error_message.classList.remove('hidden');
        if (error.response.status === 400) {
          error_message.innerHTML = t('error_invalid_credentials');
        } else {
          error_message.innerHTML = t('error_general');
        }
      }
      //window.location.href = '/example';
    } else {
      setRegisterPassword(true);
      setShowPassword(false);
      console.log('Email is valid and not registered');
      return;
    }
  };

  const doLogin = async (e) => {
    e.preventDefault();
    // Comprobar que el correo electrónico no está vacío
    if (email.trim() === '') {
      error_message.classList.remove('hidden');
      error_message.innerHTML = t('error_empty_email');
      return;
    }
    // Comprobar que el correo electrónico tiene un formato válido
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      error_message.classList.remove('hidden');
      error_message.innerHTML = t('error_invalid_email');
      return;
    }
    // Comprobar que la contraseña no está vacía
    if (password.trim() === '') {
      error_message.classList.remove('hidden');
      error_message.innerHTML = t('error_empty_password');
      return;
    }
    try {
      const user = await loginService(email, password);
      console.log(user);
    } catch (error) {
      error_message.classList.remove('hidden');
      error_message.innerHTML = t('error_invalid_credentials');
    }
  }

  return (
    <>
      <div className='dark:bg-neutral-900 bg-stone-100 min-h-screen flex flex-row justify-center items-center'>
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
              className='text-lg text-center dark:text-white text-neutral-900 mt-3 mb-4'
            >
              {isLoginMode ? t('enter_to_continue') : t('enter_to_create')}
            </motion.p>

            <AnimatePresence mode="wait">
              <motion.div
                layout
                className='w-[70%] flex flex-col justify-center items-center overflow-hidden p-2'
                transition={{ layout: { duration: 0.4, ease: 'easeInOut' } }}
              >

                <form className='flex flex-col justify-center items-center w-full'>

                  <AnimatePresence mode="wait">
                    {!isLoginMode && (
                      <motion.div
                        className='flex-1 dark:bg-neutral-800 bg-blue-50 dark:text-white text-neutral-900 p-2 rounded-lg mt-4 w-full'
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className='pl-1 pr-3 border-neutral-900 dark:border-white'>
                          <i className="pi pi-user" />
                        </span>
                        <InputText type='text' placeholder={t('input_name')} id='input_name' className='focus:outline-none' keyfilter={"alpha"} onInput={(e) => setName(e.target.value)} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    className='flex-1 dark:bg-neutral-800 bg-blue-50 dark:text-white text-neutral-900 p-2 rounded-lg mt-4 w-full'
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className='pl-1 pr-3 border-neutral-900 dark:border-white'>
                      <i className="pi pi-envelope" />
                    </span>
                    <InputText type='email' placeholder={t('input_email')} id='input_email' className='focus:outline-none flex-grow' keyfilter={"email"} onInput={(e) => handleEmailChange(e)} />
                  </motion.div>

                  <AnimatePresence mode="wait">
                    {shouldShowPassword && (
                      <motion.div
                        className='flex-1 dark:bg-neutral-800 bg-blue-50 dark:text-white text-neutral-900 p-2 rounded-lg mt-4 w-full flex items-center justify-between'
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className='pl-1 pr-3 border-neutral-900 dark:border-white'>
                          <i className="pi pi-lock" />
                        </span>
                        <InputText
                          type={showPassword ? 'text' : 'password'}
                          placeholder={t('input_password')}
                          id='input_password'
                          className='focus:outline-none flex-grow bg-transparent'
                          onInput={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              isLoginMode ? (e) => { doLogin(e) /* Handle login */ } : (e) => { doRegister(e); /* Handle register */ };
                            }
                          }}
                        />
                        <span
                          className='pl-2 pr-3 cursor-pointer text-md'
                          onClick={() => setShowPassword(prev => !prev)}
                        >
                          <i className={showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'} />
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.p id='error_message' className='text-red-500 text-sm mt-2 hidden'>
                    {/* Error message */}
                  </motion.p>

                  <motion.button
                    id='button_sign'
                    whileTap={{ scale: 0.97 }}
                    className='bg-blue-500 text-white p-2 rounded-lg mt-4 w-full transition-all duration-200 hover:bg-blue-600 active:bg-blue-700 shadow-md hover:shadow-lg'
                    onClick={isLoginMode ? (e) => { doLogin(e); /* Handle login */ } : (e) => { doRegister(e); /* Handle register */ }}
                  >
                    {isLoginMode ? t('login') : t('register')}
                  </motion.button>

                </form>

                {/* Línea divisoria y login con Google */}
                <div className='flex flex-row items-center mt-4 w-full'>
                  <hr className='flex-grow border-t border-2 dark:border-zinc-600 border-white' />
                  <p className='text-sm text-center dark:text-white text-neutral-900 mx-4'>{t('OR')}</p>
                  <hr className='flex-grow border-t border-2 dark:border-zinc-600 border-white' />
                </div>

                {/* Botón de Google */}
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  className='w-full flex flex-row justify-center items-center mt-4 dark:bg-neutral-800 bg-blue-50 p-2 rounded-lg cursor-pointer hover:bg-blue-200 active:bg-blue-300 shadow-md hover:shadow-lg transition-all duration-200 group'
                  onClick={() => window.open('http://localhost:8000/auth/google/redirect', '_self')}
                >
                  <FaGoogle className='text-2xl text-blue-500' />
                  <p className='text-sm text-center dark:text-white text-neutral-900 dark:group-hover:text-black group-hover:text-blue-500 ml-2'>
                    {t('login_google')}
                  </p>
                </motion.div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </>
  );
}

export default App;
