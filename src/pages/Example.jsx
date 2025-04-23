import { useEffect, useState, Suspense } from 'react';
import '../styles/App.css';
import { login as loginService, getUser, logout } from '../services/authService';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

function Example() {
  // Usar useTranslation para manejar la traducción
  const { t, i18n } = useTranslation();
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  // Usar useState para manejar el usuario
  const [user, setUser] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const [errorMessage, setErrorMessage] = useState('');


  const login = async (event) => {
    event.preventDefault();
    try {
      const userData = await loginService(form.email, form.password);
      setUser(userData);
    } catch (error) {
      setErrorMessage(
        error.response?.data.message
      );
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getUser()
        setUser(data)
      } catch (error) {
        setErrorMessage(
          error.response?.data.message
        );
      }
    }
  
    loadUser()
  }, [])

  return (
    <>
      <div>
        <Suspense fallback={<div>Loading translations...</div>}>
          <h1>{t('example1')}</h1>
          <button onClick={() => changeLanguage('en')}>English</button>
          <button onClick={() => changeLanguage('es')}>Español</button>
        </Suspense>
      </div>

      <div className='bg-white dark:bg-black/70 h-screen'>
        {!Object.keys(user).length ? (
          <form onSubmit={login}>
            <div className='bg-red-500 text-white p-2 rounded-md w-fit'>{t(errorMessage)}</div>

            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
            <button type="submit">Login</button>
          </form>
        ) : (
          <>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            <button>
              <Link to="/">Regresar</Link>
            </button>
            <button onClick={async () => {
              try {
                await logout();
                setUser([]);
              } catch (error) {
                setErrorMessage(
                  error.response?.data.message
                );
              }
            }}>Logout</button>
          </>
        )}

        {!Object.keys(user).length && (
          <a href='http://localhost:8000/auth/google/redirect' className='bg-blue-500 text-white p-2 rounded-md'>Login with Google</a>
        )}
      </div>
    </>
  );
}

export default Example;
