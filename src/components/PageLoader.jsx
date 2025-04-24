import React, { useEffect, useState } from 'react';
import { applyStoredTheme, getTheme } from '@/lib/theme';
import w_logo from '../assets/images/logos/Logo_w_mode.png';
import b_logo from '../assets/images/logos/Logo_b_mode.png';

function PageLoader() {
  useEffect(() => {
    applyStoredTheme();
  }, []);
  return (
    <>
      <div className="dark:bg-neutral-900 bg-stone-100 h-screen flex flex-col justify-center items-center">
        <img
          src={getTheme() ? b_logo : w_logo}
          alt="Logo loader"
          className="loader-logo not-draggable w-48 transition-transform duration-500 ease-in-out animate-pulse"
        />
      </div>
    </>
  );
}

export default PageLoader;