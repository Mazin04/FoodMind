import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router';
import { useTheme } from '@/shared/context/ThemeContext';
import { House, User, Gear, Basket, BookBookmark } from '@phosphor-icons/react';

import URLS from '@/constants/urls';

const NavbarSmall = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = (id) => {
    navigate(URLS[id]);
  };

  return (
    <div className="w-full h-full py-4 flex justify-center text-md text-neutral-900 dark:text-white bg-blue-100 dark:bg-neutral-900">
      <div className="w-full flex items-center justify-around">
        {/* Home */}
        <button
          id="nav-home"
          data-testid="nav-home-button"
          className={`dark:bg-neutral-900 dark:hover:bg-neutral-800 hover:bg-stone-300 py-2 sm:p-5 rounded-full flex justify-center items-center cursor-pointer ${
            location.pathname === URLS.HOME ? 'font-bold' : ''
          }`}
          onClick={() => redirectTo('HOME')}
        >
          <p className="hidden xl:block mr-4">{t('nav_home')}</p>
          <House
            data-testid="icon-house"
            size={25}
            color={isDarkMode ? '#fff' : '#000'}
            weight={location.pathname === URLS.HOME ? 'fill' : 'bold'}
          />
        </button>

        {/* Profile */}
        <button
          id="nav-profile"
          data-testid="nav-profile-button"
          className={`dark:bg-neutral-900 dark:hover:bg-neutral-800 hover:bg-stone-300 py-2 sm:p-5 rounded-full flex justify-center items-center cursor-pointer ${
            location.pathname === URLS.PROFILE ? 'font-bold' : ''
          }`}
          onClick={() => redirectTo('PROFILE')}
        >
          <p className="hidden xl:block mr-4">{t('nav_profile')}</p>
          <User
            data-testid="icon-user"
            size={25}
            color={isDarkMode ? '#fff' : '#000'}
            weight={location.pathname === URLS.PROFILE ? 'fill' : 'bold'}
          />
        </button>

        {/* Pantry */}
        <button
          id="nav-pantry"
          data-testid="nav-pantry-button"
          className={`dark:bg-neutral-900 dark:hover:bg-neutral-800 hover:bg-stone-300 py-2 sm:p-5 rounded-full flex justify-center items-center cursor-pointer ${
            location.pathname === URLS.PANTRY ? 'font-bold' : ''
          }`}
          onClick={() => redirectTo('PANTRY')}
        >
          <p className="hidden xl:block mr-4">{t('nav_pantry')}</p>
          <Basket
            data-testid="icon-basket"
            size={25}
            color={isDarkMode ? '#fff' : '#000'}
            weight={location.pathname === URLS.PANTRY ? 'fill' : 'bold'}
          />
        </button>

        {/* Create Recipe */}
        <button
          id="nav-create-recipe"
          data-testid="nav-create-recipe-button"
          className={`dark:bg-neutral-900 dark:hover:bg-neutral-800 hover:bg-stone-300 py-2 sm:p-5 rounded-full flex justify-center items-center cursor-pointer ${
            location.pathname === URLS.CREATE_RECIPE ? 'font-bold' : ''
          }`}
          onClick={() => redirectTo('CREATE_RECIPE')}
        >
          <p className="hidden xl:block mr-4">{t('nav_create_recipe')}</p>
          <BookBookmark
            data-testid="icon-book"
            size={25}
            color={isDarkMode ? '#fff' : '#000'}
            weight={location.pathname === URLS.CREATE_RECIPE ? 'fill' : 'bold'}
          />
        </button>

        {/* Settings */}
        <button
          id="nav-settings"
          data-testid="nav-settings-button"
          className={`dark:bg-neutral-900 dark:hover:bg-neutral-800 hover:bg-stone-300 py-2 sm:p-5 rounded-full flex justify-center items-center cursor-pointer ${
            location.pathname === URLS.SETTINGS ? 'font-bold' : ''
          }`}
          onClick={() => redirectTo('SETTINGS')}
        >
          <p className="hidden xl:block mr-4">{t('nav_settings')}</p>
          <Gear
            data-testid="icon-gear"
            size={25}
            color={isDarkMode ? '#fff' : '#000'}
            weight={location.pathname === URLS.SETTINGS ? 'fill' : 'bold'}
          />
        </button>
      </div>
    </div>
  );
};

export default NavbarSmall;
