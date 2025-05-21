import { InputTextarea } from 'primereact/inputtextarea';
import { ReactCountryFlag } from 'react-country-flag';

const RecipeDescriptionInput = ({ 
    register, 
    errors, 
    t, 
    language, 
    maxLength = 100 
}) => {
    const isSpanish = language === 'es';
    const name = isSpanish ? 'recipeDescriptionSpanish' : 'recipeDescriptionEnglish';
    const placeholder = isSpanish
        ? t('recipes.create.descriptionPlaceholderSpanish')
        : t('recipes.create.descriptionPlaceholderEnglish');
    const label = isSpanish ? 'ES' : 'EN';
    const flagCode = isSpanish ? 'es' : 'gb';

    return (
        <div className='flex w-full flex-col gap-1'>
            <div
                className={`flex border rounded-lg overflow-hidden shadow-sm transition focus-within:ring-2 focus-within:ring-blue-500 
                ${errors?.[name] ? 'border-red-500' : 'border-gray-300 dark:border-neutral-600'} bg-white dark:bg-neutral-800`}
            >
                <div className="min-w-[40px] flex flex-col items-center justify-center px-3 py-3 border-r bg-gray-100 dark:bg-neutral-700">
                    <ReactCountryFlag countryCode={flagCode} svg style={{ width: '1.25em', height: '1.35em' }} />
                    {label}
                </div>
                <InputTextarea
                    id={name}
                    {...register(name, { required: true, maxLength })}
                    autoResize
                    maxLength={maxLength}
                    rows={2}
                    className="w-full p-3 text-sm bg-transparent outline-none dark:text-white placeholder-gray-400"
                    placeholder={placeholder}
                />
            </div>
            {errors?.[name] && (
                <p className="text-xs text-red-500 mt-1">
                    {t('recipes.create.descriptionError')}
                </p>
            )}
        </div>
    );
};

export default RecipeDescriptionInput;
