import { useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactModal from 'react-modal';
import { MoonLoader } from 'react-spinners';

const AddIngredientModal = ({
    isOpen,
    onClose,
    onSubmit,
    ingredientList,
    loading,
    setAddValues,
    addValues,
    t
}) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredIngredients = ingredientList.filter((ingredient) =>
        ingredient.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const unitOptions = ['unit_gr', 'unit_ml', 'unit_u'];
    const isAddDisabled = !addValues.ingredient || !addValues.quantity || addValues.quantity <= 0;

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Add Ingredient Modal"
            className="fixed inset-0 z-50 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black/30 backdrop-blur-sm"
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            ariaHideApp={false}
        >
            <div className="bg-blue-100 dark:bg-neutral-800 p-6 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6 m-4">
                <h2 className="text-2xl font-bold text-center text-neutral-800 dark:text-white">
                    {t('add_ingredient')}
                </h2>

                {/* Selector de ingrediente */}
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        {t('ingredient')}
                    </label>
                    <Listbox
                        value={addValues.ingredient}
                        onChange={(value) => {
                            setAddValues({ ...addValues, ingredient: value });
                            setSearchTerm("");
                        }}
                    >
                        {({ open }) => (
                            <>
                                <ListboxButton className="w-full p-2 rounded-md border dark:border-neutral-700 dark:bg-neutral-700 dark:text-white text-left bg-white text-sm">
                                    {addValues.ingredient
                                        ? addValues.ingredient.name
                                        : t('select_ingredient')}
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
                                                    className="w-full px-2 py-1 text-sm border rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:border-blue-500"
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

                {/* Inputs cantidad y unidad */}
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            {t('quantity')}
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            min={0}
                            max={99999}
                            value={addValues.quantity || ''}
                            onChange={(e) => {
                                let value = Number(e.target.value);
                                if (value < 0) value = 0;
                                if (value > 99999) value = 99999;
                                setAddValues({ ...addValues, quantity: value });
                            }}
                            className="w-full p-2 rounded-md border dark:border-neutral-700 dark:bg-neutral-700 dark:text-white bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder={t('quantity_placeholder')}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            {t('unit')}
                        </label>
                        <select
                            value={addValues.unit}
                            onChange={(e) =>
                                setAddValues({ ...addValues, unit: e.target.value })
                            }
                            className="w-full p-2 rounded-md border dark:border-neutral-700 dark:bg-neutral-700 dark:text-white bg-white"
                        >
                            {unitOptions.map((unit) => (
                                <option key={unit} value={unit}>
                                    {t(unit)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-neutral-900 dark:bg-neutral-600 dark:text-white dark:hover:bg-neutral-500"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {t('cancel')}
                    </button>
                    <button
                        className={`px-4 py-2 flex rounded-md ${isAddDisabled ? 'bg-blue-900 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                        onClick={onSubmit}
                        disabled={isAddDisabled || loading}
                    >
                        {loading ? <MoonLoader size={18} /> : t('add')}
                    </button>
                </div>
            </div>
        </ReactModal>
    );
};

export default AddIngredientModal;
