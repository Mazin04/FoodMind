import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { useState } from 'react'
import { ReactCountryFlag } from 'react-country-flag'
import { LANGUAGES } from '@/constants'
import { useTranslation } from 'react-i18next'

const LanguageSelect = () => {
    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0])
    const { i18n } = useTranslation();

    const onChangeLang = (selectedLang) => {
        setSelectedLanguage(selectedLang);
        i18n.changeLanguage(selectedLang.code);
    };

    return (
        <div className="relative w-fit flex justify-center items-center"> {/* Contenedor con relative */}
            <Listbox value={selectedLanguage} onChange={onChangeLang}>
                <ListboxButton className="flex items-center justify-between min-w-[135px] w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none hover:bg-gray-100 transition duration-200">
                    <div className="flex items-center space-x-2">
                        <ReactCountryFlag countryCode={selectedLanguage.flag_code} svg className="w-5 h-5" />
                        <span className="hidden xl:flex font-medium">{selectedLanguage.label}</span>
                    </div>
                    <span className="text-gray-500 ml-2">▼</span> {/* Icono de dropdown */}
                </ListboxButton>

                <ListboxOptions className="absolute left-0 top-11 z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-all duration-200">
                    {LANGUAGES.map((lang) => (
                        <ListboxOption key={lang.code} value={lang} className="cursor-pointer">
                            {({ active, selected }) => (
                                <div className={`flex items-center space-x-2 px-4 py-2 transition-colors duration-200 
                                    ${active ? 'bg-gray-200' : 'bg-white'} 
                                    ${selected ? 'font-bold' : 'font-normal'}`}>
                                    <ReactCountryFlag countryCode={lang.flag_code} svg className="w-5 h-5" />
                                    <span className="hidden xl:flex">{lang.label}</span>
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
