import { InputText } from 'primereact/inputtext';
import { ReactCountryFlag } from 'react-country-flag';

const RecipeNameInput = ({ register, errors, t, language, maxLength = 50 }) => {
    const isSpanish = language === 'es';
    const name = isSpanish ? 'recipeNameSpanish' : 'recipeNameEnglish';
    const placeholder = isSpanish
        ? t('recipes.create.namePlaceholderSpanish')
        : t('recipes.create.namePlaceholderEnglish');
    const flagCode = isSpanish ? 'es' : 'gb';

    return (
        <div className='flex w-full flex-col gap-1'>
            <div
                className={`flex items-center border rounded-lg overflow-hidden shadow-sm transition focus-within:ring-2 focus-within:ring-blue-500 
                ${errors?.[name] ? 'border-red-500' : 'border-gray-300 dark:border-neutral-600'} bg-white dark:bg-neutral-800`}
            >
                <div className="flex items-center h-full px-3 border-r">
                    <ReactCountryFlag countryCode={flagCode} svg style={{ width: '1.25em', height: '1.35em' }} />
                </div>
                <InputText
                    id={name}
                    type="text"
                    maxLength={maxLength}
                    {...register(name, { required: true, maxLength })}
                    className="w-full py-3 p-2 text-sm bg-transparent outline-none dark:text-white placeholder-gray-400"
                    placeholder={placeholder}
                />
            </div>
            {errors?.[name] && (
                <p className="text-xs text-red-500 mt-1">{t('name_error')}</p>
            )}
        </div>
    );
};

export default RecipeNameInput;
