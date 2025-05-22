import { InputTextarea } from 'primereact/inputtextarea';
import { Trash } from '@phosphor-icons/react';
import ReactCountryFlag from 'react-country-flag';

const RecipeStepInput = ({ index, register, errors, t, onRemove }) => {
    return (
        <div className='flex flex-col gap-2'>
            <div className="flex justify-between items-center">
                <label htmlFor={`steps.${index}.en`} className='text-sm font-semibold'>
                    {t('recipes.create.step')} {index + 1}
                </label>
                <button
                    type="button"
                    className="bg-red-500 text-white flex justify-center items-center p-1 rounded-md hover:bg-red-600 transition disabled:opacity-50"
                    onClick={() => onRemove(index)}
                    disabled={index === 0}
                    aria-label={t('recipes.create.removeStep')}
                >
                    <Trash size={18} />
                </button>
            </div>

            <div className='flex flex-col md:flex-row gap-4'>
                {/* Español */}
                <div className='flex w-full flex-col gap-1'>
                    <div className={`flex border rounded-lg overflow-hidden shadow-sm transition focus-within:ring-2 focus-within:ring-blue-500 ${errors?.steps?.[index]?.es ? 'border-red-500' : 'border-gray-300 dark:border-neutral-600'} bg-white dark:bg-neutral-800`}>
                        <div className="min-w-[40px] flex items-center justify-center px-3 py-3 border-r bg-gray-100 dark:bg-neutral-700">
                            <ReactCountryFlag countryCode="es" svg style={{ width: '1.25em', height: '1.35em' }} />
                        </div>
                        <InputTextarea
                            id={`steps.${index}.es`}
                            {...register(`steps.${index}.es`, { required: true })}
                            autoResize
                            maxLength={500}
                            rows={2}
                            className="w-full p-3 text-sm bg-transparent outline-none dark:text-white placeholder-gray-400"
                            placeholder={t('recipes.create.stepPlaceholder')}
                        />
                    </div>
                </div>

                {/* Inglés */}
                <div className='flex w-full flex-col gap-1'>
                    <div className={`flex border rounded-lg overflow-hidden shadow-sm transition focus-within:ring-2 focus-within:ring-blue-500 ${errors?.steps?.[index]?.en ? 'border-red-500' : 'border-gray-300 dark:border-neutral-600'} bg-white dark:bg-neutral-800`}>
                        <div className="min-w-[40px] flex items-center justify-center px-3 py-3 border-r bg-gray-100 dark:bg-neutral-700">
                            <ReactCountryFlag countryCode="gb" svg style={{ width: '1.25em', height: '1.35em' }} />
                        </div>
                        <InputTextarea
                            id={`steps.${index}.en`}
                            {...register(`steps.${index}.en`, { required: true })}
                            autoResize
                            maxLength={500}
                            rows={2}
                            className="w-full p-3 text-sm bg-transparent outline-none dark:text-white placeholder-gray-400"
                            placeholder={t('recipes.create.stepPlaceholder')}
                        />
                    </div>
                </div>
            </div>

            {errors?.steps?.[index]?.es && (
                <span className="text-red-500 text-xs">
                    {errors?.steps?.[index]?.es?.message || t('recipes.create.stepRequired')}
                </span>
            )}
        </div>
    );
};

export default RecipeStepInput;
