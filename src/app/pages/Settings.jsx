import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { useTranslation } from 'react-i18next';

import { SignOut } from '@phosphor-icons/react';
import { DarkInner } from "@theme-toggles/react";
import { MoonLoader } from "react-spinners";

import URLS from "@/constants/urls";
import { getUser, logout } from '@/features/auth/services/authService';
import { useTheme } from "@/shared/context/ThemeContext.jsx";
import LanguageSelect from "@/shared/components/LanguageSelect.jsx";
import PageLoader from "@/shared/components/PageLoader.jsx";
import ConfirmationModal from '@/shared/components/ConfirmationModal';

const Settings = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { toggleTheme } = useTheme();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState('');

    const [loading, setLoading] = useState(true);
    const [signOutModalIsOpen, setSignOutModalIsOpen] = useState(false);
    const [signOutLoading, setSignOutLoading] = useState(false);

    const handleOpenModalSignOut = () => {
        // Open modal to confirm sign out
        setSignOutModalIsOpen(true);
    }

    const handleSignOut = async () => {
        try {
            await logout();
            navigate(URLS.MAIN);
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            setSignOutLoading(false);
            setSignOutModalIsOpen(false);
        }
    };

    useEffect(() => {
        document.title = t('settings_title');

        async function fetchData() {
            try {
                const user = await getUser();

                setName(user.name);
                setEmail(user.email);
                const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                const formattedDate = new Date(user.created_at).toLocaleString('es-ES', options).replace(',', '');
                setDate(formattedDate);
                document.title = "Foodmind - Settings";
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <>
            {loading ? (
                <PageLoader />
            ) : (
                <>
                <div className="w-full h-full py-6 sm:p-6 flex flex-col items-center justify-center text-neutral-900 dark:text-white bg-stone-100 dark:bg-neutral-900">
                    <h1 className="text-4xl font-bold">{t('settings')}</h1>
                    <div className='w-[90%] sm:w-[80%] lg:w-[60%] h-full flex flex-col items-start justify-start mt-8'>
                        <div className='h-fit w-full flex flex-col items-start space-y-1 hover:bg-stone-300 dark:hover:bg-neutral-800 border-b-1 dark:border-neutral-700 p-4'>
                            <p className='font-bold'>{t('settings_username')}</p>
                            <p className='text-[#526470] dark:text-[#5b5e63]'>{name}</p>
                        </div>

                        <div className='h-fit w-full flex flex-col items-start space-y-1 hover:bg-stone-300 dark:hover:bg-neutral-800 border-b-1 dark:border-neutral-700 p-4'>
                            <p className='font-bold'>{t('settings_email')}</p>
                            <p className='text-[#526470] dark:text-[#5b5e63]'>{email}</p>
                        </div>

                        <div className='h-fit w-full flex flex-col items-start space-y-1 hover:bg-stone-300 dark:hover:bg-neutral-800 border-b-1 dark:border-neutral-700 p-4'>
                            <p className='font-bold'>{t('settings_date_account')}</p>
                            <p className='text-[#526470] dark:text-[#5b5e63]'>{date}</p>
                        </div>

                        <div className='h-fit w-full flex flex-row items-center justify-between hover:bg-stone-300 dark:hover:bg-neutral-800 border-b-1 dark:border-neutral-700 p-4'>
                            <div>
                                <p className='font-bold'>{t('settings_language')}</p>
                                <p className='text-[#526470] dark:text-[#5b5e63]'>{t('settings_language_tip')}</p>
                            </div>
                            <LanguageSelect />
                        </div>

                        <div className='h-fit w-full flex flex-row items-center justify-between hover:bg-stone-300 dark:hover:bg-neutral-800 border-b-1 dark:border-neutral-700 p-4'>
                            <div>
                                <p className='font-bold'>{t('settings_color_theme')}</p>
                                <p className='text-[#526470] dark:text-[#5b5e63]'>{t('settings_color_theme_tip')}</p>
                            </div>
                            <DarkInner duration={500} onToggle={toggleTheme} className='text-4xl' />
                        </div>

                        <div className='h-fit w-full flex flex-row items-center justify-between hover:bg-stone-300 dark:hover:bg-neutral-800 border-b-1 dark:border-neutral-700 p-4'>
                            <div>
                                <p className='font-bold'>{t('settings_sign_out')}</p>
                                <p className='text-[#526470] dark:text-[#5b5e63]'>{t('settings_sign_out_tip')}</p>
                            </div>
                            <button
                                className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200 active:bg-red-800"
                                onClick={handleOpenModalSignOut}
                            >
                                {signOutLoading ? (
                                    <MoonLoader size={18} />
                                ) : (
                                    <SignOut size={24} weight="bold"/>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <ConfirmationModal
                    isOpen={signOutModalIsOpen}
                    onCancel={() => setSignOutModalIsOpen(false)}
                    onConfirm={handleSignOut}
                    loading={signOutLoading}
                    title={t('settings_sign_out')}
                    subtitle={t('settings_sign_out_confirm')}
                    cancelText={t('cancel')}
                    confirmText={t('confirm')}
                />
                </>
            )}
        </>

    );
}

export default Settings;