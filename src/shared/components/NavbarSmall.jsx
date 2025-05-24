import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTheme } from '@/shared/context/ThemeContext';
import { House, DotsThree, User, Gear, Basket, BookBookmark } from '@phosphor-icons/react';
import { getUser } from '@/features/auth/services/authService';
import { MoonLoader } from "react-spinners";

import w_logo from '@/assets/images/logos/Logo_w_mode.png';
import b_logo from '@/assets/images/logos/Logo_b_mode.png';
import URLS from '@/constants/urls';

const NavbarSmall = () => {
    const { isDarkMode } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const redirectTo = (id) => {
        navigate(URLS[id]);
    }
    return (
        <div className="w-full h-full py-4 flex justify-center text-md text-neutral-900 dark:text-white bg-stone-100 dark:bg-neutral-900">
            <div className="w-full flex items-center justify-around">
                {/* Home button */}
                <button
                    className={`dark:bg-neutral-900 dark:hover:bg-neutral-800 hover:bg-stone-300 py-2 sm:p-5 rounded-full flex justify-center items-center cursor-pointer ${location.pathname === URLS.HOME ? "font-bold" : ""}`}
                    id='home'
                    onClick={() => redirectTo('HOME')}>
                    <p className='hidden xl:block mr-4'>{t('nav_home')}</p>
                    <House
                        size={25}
                        color={isDarkMode ? "#fff" : "#000"}
                        weight={location.pathname === URLS.HOME ? "fill" : "bold"}
                    />
                </button>
                {/* Profile button */}
                <button
                    className={`dark:bg-neutral-900 dark:hover:bg-neutral-800 hover:bg-stone-300 py-2 sm:p-5 rounded-full flex justify-center items-center cursor-pointer ${location.pathname === URLS.PROFILE ? "font-bold" : ""}`}
                    id='profile'
                    onClick={() => redirectTo('PROFILE')}>
                    <p className='hidden xl:block mr-4'>{t('nav_profile')}</p>
                    <User
                        size={25}
                        color={isDarkMode ? "#fff" : "#000"}
                        weight={location.pathname === URLS.PROFILE ? "fill" : "bold"}
                    />
                </button>
                {/* Pantry button */}
                <button
                    className={`dark:bg-neutral-900 dark:hover:bg-neutral-800 hover:bg-stone-300 py-2 sm:p-5 rounded-full flex justify-center items-center cursor-pointer ${location.pathname === URLS.PANTRY ? "font-bold" : ""}`}
                    id='profile'
                    onClick={() => redirectTo('PANTRY')}>
                    <p className='hidden xl:block mr-4'>{t('nav_pantry')}</p>
                    <Basket
                        size={25}
                        color={isDarkMode ? "#fff" : "#000"}
                        weight={location.pathname === URLS.PANTRY ? "fill" : "bold"}
                    />
                </button>
                {/* Recipes button */}
                <button
                    className={`dark:bg-neutral-900 dark:hover:bg-neutral-800 hover:bg-stone-300 py-2 sm:p-5 rounded-full flex justify-center items-center cursor-pointer ${location.pathname === URLS.CREATE_RECIPE ? "font-bold" : ""}`}
                    id='settings'
                    onClick={() => redirectTo('CREATE_RECIPE')}
                >
                    <p className='hidden xl:block mr-4'>{t('nav_create_recipe')}</p>
                    <BookBookmark
                        size={25}
                        color={isDarkMode ? "#fff" : "#000"}
                        weight={location.pathname === URLS.CREATE_RECIPE ? "fill" : "bold"}
                    />
                </button>
                {/* Settings button */}
                <button
                    className={`dark:bg-neutral-900 dark:hover:bg-neutral-800 hover:bg-stone-300 py-2 sm:p-5 rounded-full flex justify-center items-center cursor-pointer ${location.pathname === URLS.SETTINGS ? "font-bold" : ""}`}
                    id='settings'
                    onClick={() => redirectTo('SETTINGS')}
                >
                    <p className='hidden xl:block mr-4'>{t('nav_settings')}</p>
                    <Gear
                        size={25}
                        color={isDarkMode ? "#fff" : "#000"}
                        weight={location.pathname === URLS.SETTINGS ? "fill" : "bold"}
                    />
                </button>
            </div>
        </div>
    );
}

export default NavbarSmall;