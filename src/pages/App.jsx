import { useEffect, useState, Suspense } from 'react';
import '../styles/App.css';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import w_logo from '../assets/images/logos/Logo_w_mode.png';
import b_logo from '../assets/images/logos/Logo_b_mode.png';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

function App() {

  // Usar useTranslation para manejar la traducción
  const { t, i18n } = useTranslation();
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  

  return (
    <>
      <img src={w_logo} alt="Logo" className="logo" />
    </>
  );
}

export default App;
