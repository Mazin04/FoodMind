import { useState } from 'react';
import { useNavigate } from 'react-router';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { SyncLoader } from 'react-spinners';
import { FaGoogle } from 'react-icons/fa';

import {
  isEmailRegistered,
  registerUser,
  login as loginService,
} from '@/services/authService';

import {
  isEmailValid,
  isEmailEmpty,
  isPasswordValid,
  isNameEmpty,
  isPasswordEmpty,
} from '@/utils/validators';
import URLS from '../constants/urls';

const AuthForm = ({ isLoginMode, isDarkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [registerPassword, setRegisterPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const shouldShowPassword = isLoginMode || (registerPassword && !isLoginMode);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setRegisterPassword(false);
  };

  const doRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isNameEmpty(name)) return setErr(t('error_empty_name'));
    if (isEmailEmpty(email)) return setErr(t('error_empty_email'));
    if (!isEmailValid(email)) return setErr(t('error_invalid_email'));

    const isEmailAvailable = await isEmailRegistered(email);
    if (isEmailAvailable.registered && !shouldShowPassword) {
      return setErr(t('error_email_registered'));
    } else if (!isEmailAvailable.registered && shouldShowPassword) {
      if (isPasswordEmpty(password)) return setErr(t('error_empty_password'));
      if (!isPasswordValid(password)) return setErr(t('error_invalid_password'));

      try {
        const user = await registerUser(name, email, password);
        setErrorMessage('success_register');
        navigate(URLS.HOME);
      } catch (error) {
        const code = error.response?.status;
        setErrorMessage(t(code === 400 ? 'error_invalid_credentials' : 'error_general'));
      } finally {
        setIsLoading(false);
      }
    } else {
      setRegisterPassword(true);
      setShowPassword(false);
    }
  };

  const doLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isEmailEmpty(email)) return setErr(t('error_empty_email'));
    if (!isEmailValid(email)) return setErr(t('error_invalid_email'));
    if (password.trim() === '') return setErr(t('error_empty_password'));

    try {
      const user = await loginService(email, password);
      navigate(URLS.HOME);
    } catch (error) {
      setErrorMessage(t(error.response?.data?.message || 'error_generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const setErr = (msg) => {
    setErrorMessage(msg);
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          layout
          className='w-[70%] flex flex-col justify-center items-center overflow-hidden p-2'
          transition={{ layout: { duration: 0.4, ease: 'easeInOut' } }}
        >
          {isLoading ? (
            <SyncLoader
              color={isDarkMode ? '#ffffff' : '#171717'}
              loading={isLoading}
              className='py-8'
              size={15}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            <form className='flex flex-col justify-center items-center w-full' onSubmit={(e) => {e.preventDefault(); isLoginMode ? doLogin(e) : doRegister(e); }}>
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
                    <InputText type='text' placeholder={t('input_name')} id='input_name' className='focus:outline-none text-sm md:text-base' keyfilter={"alpha"} onInput={(e) => setName(e.target.value)} />
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
                <InputText type='email' placeholder={t('input_email')} id='input_email' className='focus:outline-none flex-grow text-sm md:text-base' keyfilter={"email"} onInput={(e) => handleEmailChange(e)} />
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
                      className='focus:outline-none flex-grow bg-transparent text-sm md:text-base'
                      onInput={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          isLoginMode ? (e) => { doLogin(e) /* Handle login */ } : (e) => { doRegister(e); /* Handle register */ };
                        }
                      }}
                    />
                    <span
                      className='pl-2 pr-3 cursor-pointer text-base'
                      onClick={() => setShowPassword(prev => !prev)}
                    >
                      <i className={showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'} />
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {errorMessage && (
                <motion.p
                  className="text-red-500 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {errorMessage}
                </motion.p>
              )}

              <motion.button
                id='button_sign'
                type="submit"
                whileTap={{ scale: 0.97 }}
                className='bg-blue-500 text-white p-2 rounded-lg mt-4 w-full transition-all duration-200 hover:bg-blue-600 active:bg-blue-700 shadow-md hover:shadow-lg'
              >
                {isLoginMode ? t('login') : t('register')}
              </motion.button>

            </form>
          )}


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
    </>
  );
};

export default AuthForm;
