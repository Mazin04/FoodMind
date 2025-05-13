import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTheme } from '@/context/ThemeContext';
import { House, DotsThree, User, Gear, Basket } from '@phosphor-icons/react';
import { getUser } from '@/services/authService';
import { MoonLoader } from "react-spinners";

import w_logo from '@/assets/images/logos/Logo_w_mode.png';
import b_logo from '@/assets/images/logos/Logo_b_mode.png';
import URLS from '@/constants/urls';

function Navbar() {
    const { isDarkMode } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [avatar, setAvatar] = useState(null);
    const [placeholder, setPlaceholder] = useState(null);
    const [userName, setUserName] = useState('User');

    useEffect(() => {
        async function fetchData() {
            try {
                const user = await getUser();

                const placeholderUrl = `https://avatar.iran.liara.run/username?username=${user.name}`;
                setUserName(user.name);
                setPlaceholder(placeholderUrl);
                setAvatar(user.avatar || placeholderUrl);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        fetchData();
    }, []);

    const redirectTo = (id) => {
        navigate(URLS[id]);
    }

    return (
        <div className="w-full h-full min-w-[60px] sm:min-w-[90px] py-4 sm:p-2 flex flex-col items-center justify-between xl:items-end space-y-4 text-md text-neutral-900 dark:text-white bg-stone-100 dark:bg-neutral-900 border-r-1 border-neutral-700">
            <div>
                {/* Logo and menu for small screens */}
                <div className='flex justify-center xl:justify-end mb-4 cursor-pointer' onClick={() => redirectTo('HOME')}>
                    <img
                        src={isDarkMode ? b_logo : w_logo}
                        alt="Logo"
                        className='w-[50px] xl:w-[70px] h-auto'
                    />
                </div>
                {/* Navbar items */}
                <div className='flex flex-col items-center xl:items-end justify-center space-y-4'>
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
            {/* Avatar */}
            <div className='mb-2'>
                <div
                    className="flex items-center justify-center xl:justify-start gap-4 sm:px-5 py-4 rounded-full bg-stone-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 hover:bg-stone-300 cursor-pointer w-full xl:w-auto"
                    onClick={() => redirectTo('PROFILE')}
                >
                    <div className="flex-shrink-0">
                        {avatar || placeholder ? (
                            <img
                                src={avatar || placeholder}
                                alt="Avatar"
                                className="w-10 h-10 rounded-full border-2 border-neutral-700 dark:border-neutral-500 object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = placeholder;
                                }}
                            />
                        ) : (
                            <MoonLoader
                                color={isDarkMode ? "#fff" : "#000"}
                                size={30}
                                className="w-10 h-10 rounded-full border-2 border-neutral-700 dark:border-neutral-500"
                            />
                        )}
                    </div>

                    <div className="hidden xl:flex items-center space-x-2">
                        <p className="text-sm font-bold">{userName}</p>
                        <DotsThree size={25} color={isDarkMode ? "#fff" : "#000"} weight="bold" />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Navbar;