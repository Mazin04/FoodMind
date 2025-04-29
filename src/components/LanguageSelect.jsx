import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { useState, useEffect } from 'react'
import { ReactCountryFlag } from 'react-country-flag'
import { LANGUAGES } from '@/constants'
import { useTranslation } from 'react-i18next'
import { getTheme } from '@/lib/theme';

const LanguageSelect = () => {
    const { i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
    const [setIsDarkMode] = useState(getTheme());

    // Detectar idioma actual de i18n al montar el componente
    useEffect(() => {
        const currentLang = LANGUAGES.find(lang => lang.code === i18n.language);
        if (currentLang) {
            setSelectedLanguage(currentLang);
        }
    }, [i18n.language]);

    // Escuchar cambios en el tema (modo oscuro/claro)
    useEffect(() => {
        const handleThemeChange = () => {
            setIsDarkMode(getTheme());
        };

        window.addEventListener('storage', handleThemeChange);
        return () => {
            window.removeEventListener('storage', handleThemeChange);
        };
    }, [setIsDarkMode]);

    const onChangeLang = (selectedLang) => {
        setSelectedLanguage(selectedLang);
        i18n.changeLanguage(selectedLang.code);
    };

    return (
        <div className="relative w-fit flex justify-center items-center">
            <Listbox value={selectedLanguage} onChange={onChangeLang}>
                <ListboxButton className='dark:text-stone-200 dark:bg-neutral-800 dark:border-neutral-600 dark:hover:bg-neutral-700 text-neutral-700 bg-white border-gray-300 hover:bg-gray-100 flex items-center justify-between min-w-[50px] w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none transition duration-200'>
                    <div className="flex items-center space-x-2">
                        <ReactCountryFlag countryCode={selectedLanguage.flag_code} svg className="w-5 h-5" />
                        <span className="hidden xl:flex font-medium">{selectedLanguage.label}</span>
                    </div>
                    <span className='dark:text-stone-200 text-neutral-700 ml-2'>▼</span>
                </ListboxButton>

                <ListboxOptions className='dark:bg-neutral-800 dark:border-neutral-600 bg-white border-gray-300 absolute left-0 top-11 z-20 w-fit xl:w-full mt-1 border rounded-lg shadow-lg overflow-hidden transition-all duration-200'>
                    {LANGUAGES.map((lang) => (
                        <ListboxOption key={lang.code} value={lang} className="cursor-pointer">
                            {({ active, selected }) => (
                                <div className={`flex items-center xl:space-x-2 px-4 py-2 transition-colors duration-200 
                                    ${active ? 'dark:bg-neutral-700 bg-gray-200' : 'dark:bg-neutral-800 bg-white'} 
                                    ${selected ? 'font-bold' : 'font-normal'}`}>
                                    <ReactCountryFlag countryCode={lang.flag_code} svg className="w-5 h-5" />
                                    <span className="hidden xl:flex dark:text-white">{lang.label}</span>
                                </div>
                            )}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </Listbox>
        </div>
    )
}

export default LanguageSelect;
