import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { Trash } from '@phosphor-icons/react';

const RecipeIngredient = ({ ingredientList, index, register, setValue, watch, errors, isSubmitted, onRemove }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");

    const unitOptions = ['unit_gr', 'unit_ml', 'unit_u'];

    const selectedIngredient = watch(`ingredients.${index}.ingredient`);
    const selectedUnit = watch(`ingredients.${index}.unit`);

    useEffect(() => {
        if (!selectedUnit) {
            setValue(`ingredients.${index}.unit`, 'unit_gr');
        }
    }, [selectedUnit, index, setValue]);

    const ingredientError = isSubmitted && !selectedIngredient;

    const filteredIngredients = ingredientList.filter((ingredient) =>
        ingredient.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl items-stretch md:items-center">

                {/* Quantity input */}
                <input
                    type="number"
                    {...register(`ingredients.${index}.quantity`, {
                        required: true,
                        min: 1,
                        max: 99999,
                        valueAsNumber: true,
                    })}
                    className={`w-full md:max-w-[6rem] p-2 border ${ingredientError ? 'border-red-500' : 'border-gray-300 dark:border-neutral-700'} rounded-lg transition focus:outline-blue-500 dark:text-white dark:bg-neutral-700 bg-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                    placeholder={t('quantity')}
                />

                {/* Ingredient selector */}
                <div className="flex-1 min-w-0">
                    <Listbox
                        value={selectedIngredient}
                        onChange={(value) => {
                            setValue(`ingredients.${index}.ingredient`, value, { shouldValidate: true });
                            setSearchTerm("");
                        }}
                    >
                        {({ open }) => (
                            <>
                                <ListboxButton
                                    className={`w-full p-2 dark:bg-neutral-700 rounded-md border text-sm text-left overflow-hidden text-ellipsis whitespace-nowrap focus:outline-blue-500
                                        ${ingredientError ? 'border-red-500' : 'border-gray-300 dark:border-neutral-700'} dark:text-white bg-white`}
                                >
                                    {selectedIngredient ? selectedIngredient.name : t('select_ingredient')}
                                </ListboxButton>

                                <AnimatePresence>
                                    {open && (
                                        <ListboxOptions
                                            anchor="bottom"
                                            className={`absolute z-50 bg-white dark:bg-neutral-800 rounded-md shadow-md border dark:border-neutral-700 mt-1 w-[80%] md:w-[45%] lg:w-[20%] ${ingredientList.length > 9 ? 'h-89' : 'h-fit'} overflow-auto`}
                                            static
                                            as={motion.div}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                        >
                                            <div className="px-3 py-2 sticky top-0 bg-white dark:bg-neutral-800 z-10">
                                                <input
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    placeholder={t('search')}
                                                    className="w-full px-2 py-1 text-sm border rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                                />
                                            </div>
                                            {filteredIngredients.length > 0 ? (
                                                filteredIngredients.map((option) => (
                                                    <ListboxOption
                                                        key={option.id}
                                                        value={option}
                                                        className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-100 dark:hover:bg-neutral-700 dark:text-white"
                                                    >
                                                        {option.name}
                                                    </ListboxOption>
                                                ))
                                            ) : (
                                                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                                    {t('no_results')}
                                                </div>
                                            )}
                                        </ListboxOptions>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </Listbox>
                </div>

                {/* Unit selector */}
                <select
                    value={selectedUnit || 'unit_gr'}
                    onChange={(e) => {
                        setValue(`ingredients.${index}.unit`, e.target.value);
                    }}
                    className={`w-full md:max-w-[6rem] p-2 rounded-md border text-sm dark:border-neutral-700 dark:bg-neutral-700 dark:text-white bg-white focus:outline-blue-500 ${ingredientError ? 'border-red-500' : 'border-gray-300 dark:border-neutral-700'}`}
                >
                    {unitOptions.map((unit) => (
                        <option key={unit} value={unit}>
                            {t(unit)}
                        </option>
                    ))}
                </select>

                {/* Remove button */}
                <button
                    type="button"
                    className="bg-red-500 text-white flex justify-center items-center p-2 rounded-md hover:bg-red-700 transition duration-200 disabled:cursor-not-allowed disabled:bg-red-900 disabled:text-stone-400"
                    onClick={() => onRemove(index)}
                    disabled={index === 0}
                >
                    <Trash size={22} />
                </button>
            </div>

            {/* Error messages */}
            {errors?.ingredients?.[index]?.quantity && (
                <span className="text-red-500 text-xs">{t('quantity_error')}</span>
            )}
            {ingredientError && (
                <span className="text-red-500 text-xs">{t('ingredient_error')}</span>
            )}
        </div>

    );
};

export default RecipeIngredient;
