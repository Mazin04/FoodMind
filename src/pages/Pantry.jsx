import { useEffect, useState } from 'react';
import ContentLoader from '@/components/ContentLoader';
import { useTranslation } from 'react-i18next';
import { getUserPantry, deleteIngredientPantry, cleanIngredientPantry, editIngredientPantry, getIngredientList, addIngredientPantry } from '@/services/authService';
import { Trash, PencilSimple, Plus, Check, List } from '@phosphor-icons/react';
import { MoonLoader } from "react-spinners";
import ConfirmationModal from '@/components/ConfirmationModal';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import ReactModal from 'react-modal';
import { motion, AnimatePresence } from 'framer-motion';


const Pantry = () => {
    const unitOptions = ['unit_gr', 'unit_ml', 'unit_u'];

    const { t } = useTranslation();

    const [userPantry, setUserPantry] = useState([]);
    const [ingredientList, setIngredientList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pantry cleaning actions
    const [cleanPantryModalIsOpen, setCleanPantryModalIsOpen] = useState(false);
    const [cleanPantryLoading, setCleanPantryLoading] = useState(false);

    // Ingredient adding actions
    const [addIngredientModalIsOpen, setAddIngredientModalIsOpen] = useState(false);
    const [addIngredientLoading, setAddIngredientLoading] = useState(false);
    const [addingIngredient, setAddingIngredient] = useState(false);

    const [deletingIngredientId, setDeletingIngredientId] = useState(null);
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [editingIngredientId, setEditingIngredientId] = useState(null);
    const [confirmEditingIngredient, setConfirmEditingIngredient] = useState(false);
    // Values for the ingredient being edited
    const [editedValues, setEditedValues] = useState({});
    // Values for the ingredient being added
    const [addValues, setAddValues] = useState({});
    const isAddDisabled = !addValues.ingredient || !addValues.quantity || addValues.quantity <= 0;

    useEffect(() => {
        async function fetchData() {
            try {
                const pantry = await getUserPantry();
                setUserPantry(pantry);
            } catch (error) {
                console.error("Error fetching user pantry:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleAddIngredient = async () => {
        setAddIngredientLoading(true);
        // Fetch ingredient list if not already fetched
        if (ingredientList.length === 0) {
            try {
                const ingredientList = await getIngredientList();
                setIngredientList(ingredientList);
                setAddValues({ ingredient: null, quantity: '', unit: unitOptions[0] });
                // Open modal to add new ingredient
                setAddIngredientModalIsOpen(true);
            } catch (error) {
                console.error("Error fetching ingredient list:", error);
            }
        } else {
            // Open modal to add new ingredient
            setAddIngredientModalIsOpen(true);
        }
    }

    const handleAddIngredientToPantry = async () => {
        setAddingIngredient(true);
        try {
            const ingredient = {
                ingredient_id: addValues.ingredient.id,
                name: addValues.ingredient.name,
                quantity: parseFloat(addValues.quantity),
                unit: addValues.unit
            };
            console.log(ingredient);
            const response = await addIngredientPantry(ingredient);
            if (response) {
                setUserPantry(prevPantry => [...prevPantry, ingredient]);
                setAddValues({});
            }
        } catch (error) {
            console.error("Error adding ingredient to pantry:", error);
        } finally {
            setAddingIngredient(false);
            setAddIngredientLoading(false);
            setAddIngredientModalIsOpen(false);
        }
    }

    useEffect(() => {
        console.log(userPantry);
    }, [userPantry]);

    const handleOpenModalCleanPantry = () => {
        // Open modal to confirm cleaning pantry
        setCleanPantryModalIsOpen(true);
    }

    const handleCleanPantry = async () => {
        setCleanPantryModalIsOpen(false);
        setCleanPantryLoading(true);
        try {
            const response = await cleanIngredientPantry();
            if (response) {
                setUserPantry([]);
            }
        } catch (error) {
            console.error("Error cleaning pantry:", error);
        } finally {
            setCleanPantryLoading(false);
            setCleanPantryModalIsOpen(false);
        }
    }

    const handleDeleteIngredient = async (ingredientId) => {
        setDeletingIngredientId(ingredientId);
        try {
            const response = await deleteIngredientPantry(ingredientId);
            if (response) {
                setUserPantry(userPantry.filter(item => item.ingredient_id !== ingredientId));
            }
        } catch (error) {
            console.error("Error deleting ingredient:", error);
        } finally {
            setDeletingIngredientId(null);
        }
    }

    const handleEditIngredient = (ingredientId) => {
        const ingredient = userPantry.find(item => item.ingredient_id === ingredientId);
        setEditingIngredientId(ingredientId);
        setEditingIngredient(true);
        setEditedValues({
            quantity: ingredient.quantity,
            unit: ingredient.unit
        });
    }

    const confirmEditIngredient = async (ingredientId) => {
        setConfirmEditingIngredient(true);
        try {
            const response = await editIngredientPantry(ingredientId, editedValues);
            if (response) {
                setUserPantry(prevPantry =>
                    prevPantry.map(item =>
                        item.ingredient_id === ingredientId
                            ? { ...item, quantity: editedValues.quantity, unit: editedValues.unit }
                            : item
                    )
                );
            }
        } catch (error) {
            console.error("Error editing ingredient:", error);
        } finally {
            setConfirmEditingIngredient(false);
            setEditingIngredientId(null);
            setEditingIngredient(false);
            setEditedValues({});
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedValues(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const [searchTerm, setSearchTerm] = useState("");

    const filteredIngredients = ingredientList.filter((ingredient) =>
        ingredient.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // TODO: Block delete ingredient if already deleting another ingredient
    // TODO: Extract modal to a separate component
    // TODO: Extract ingredient list to a separate component
    return (
        loading ? (
            <ContentLoader />
        ) : (
            <div className="flex flex-col items-center justify-center h-screen w-full p-2 md:p-4">
                <div className="w-full h-full rounded-lg p-4 xl:p-6 2xl:p-8 bg-stone-50 dark:bg-neutral-800 shadow-md">
                    <div className='flex flex-row items-center justify-between mb-4'>
                        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-white">Your Pantry:</h2>
                        <div className="flex justify-end items-center space-x-4">
                            <button
                                className="bg-blue-500 flex text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
                                onClick={handleAddIngredient}
                                disabled={addIngredientLoading}
                            >
                                {addIngredientLoading || addingIngredient ? (
                                    <MoonLoader size={18} />
                                ) : (
                                    <Plus size={24} />
                                )}
                            </button>

                            {/* Can clean pantry ingredients if there's any */}
                            {userPantry.length > 0 && (
                                <button
                                    className="bg-red-500 text-white flex p-2 rounded-md hover:bg-red-700 transition duration-200"
                                    onClick={handleOpenModalCleanPantry}
                                    disabled={cleanPantryLoading}
                                >
                                    {cleanPantryLoading ? (
                                        <MoonLoader size={18} />
                                    ) : (
                                        <Trash size={24} />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-start w-full h-full">
                        {Array.isArray(userPantry) && userPantry.length > 0 ? (
                            <ul className="w-full divide-y dark:divide-gray-200 overflow-y-auto mb-12">
                                {userPantry.map((item) => (
                                    <li key={item.ingredient_id} className={` p-4 flex justify-between items-center space-x-10 ${editingIngredient && editingIngredientId === item.ingredient_id ? 'dark:bg-neutral-900 bg-stone-200' : 'dark:bg-neutral-800 dark:hover:bg-neutral-700 hover:bg-stone-300'}`}>
                                        <span className="text-neutral-900 dark:text-white font-bold">{item.name}</span>
                                        <div className='flex flex-row items-center justify-between space-x-6'>
                                            {editingIngredientId === item.ingredient_id ? (
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="number"
                                                        name="quantity"
                                                        value={editedValues.quantity}
                                                        onChange={handleInputChange}
                                                        className="w-15 p-1 rounded-md border dark:bg-neutral-700 dark:text-white text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    />
                                                    <Listbox value={editedValues.unit} onChange={(value) => setEditedValues({ ...editedValues, unit: value })}>
                                                        <ListboxButton className="w-20 p-1 rounded-md border dark:bg-neutral-700 dark:text-white text-center">
                                                            {t(editedValues.unit)}
                                                        </ListboxButton>
                                                        <ListboxOptions anchor="bottom" className={"absolute z-10 bg-white dark:bg-neutral-800 rounded-md border dark:border-neutral-700 shadow-lg max-h-60 w-20 overflow-auto cursor-pointer"}>
                                                            {unitOptions.map((option, index) => (
                                                                <ListboxOption key={index} value={option} className="p-2 dark:text-white dark:hover:bg-neutral-700 hover:bg-stone-300 border-b dark:border-neutral-700">
                                                                    {t(option)}
                                                                </ListboxOption>
                                                            ))}
                                                        </ListboxOptions>
                                                    </Listbox>
                                                </div>
                                            ) : (
                                                <span className="text-neutral-500 dark:text-neutral-400">
                                                    {parseFloat(item.quantity) % 1 === 0
                                                        ? parseInt(item.quantity)
                                                        : parseFloat(item.quantity).toFixed(2)} {t(item.unit)}
                                                </span>
                                            )}
                                            <div className='flex flex-col space-y-2'>
                                                <button
                                                    className="text-blue-500 flex hover:text-blue-700 transition duration-200 disabled:text-blue-900 disabled:cursor-not-allowed cursor-pointer"
                                                    disabled={editingIngredient && editingIngredientId !== item.ingredient_id}
                                                >
                                                    {editingIngredientId === item.ingredient_id && editingIngredient ? (
                                                        confirmEditingIngredient ? (
                                                            <MoonLoader color="#00c951" size={16} />
                                                        ) : (
                                                            <Check size={20} className='text-green-500' onClick={() => confirmEditIngredient(item.ingredient_id)} />
                                                        )
                                                    ) : (
                                                        <PencilSimple size={20}
                                                            onClick={() => {
                                                                handleEditIngredient(item.ingredient_id);
                                                            }} />
                                                    )}
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-700 flex transition duration-200"
                                                    disabled={deletingIngredientId === item.ingredient_id}
                                                    onClick={() => handleDeleteIngredient(item.ingredient_id)}
                                                >
                                                    {deletingIngredientId === item.ingredient_id ? (
                                                        <MoonLoader color="#fb2c36" size={16} />
                                                    ) : (
                                                        <Trash size={20} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className='flex flex-col items-center justify-center w-full h-full space-y-2'>
                                <p className="text-neutral-800 text-lg font-bold dark:text-white">{t('empty_pantry')}</p>
                                <p className='text-neutral-500 font-semibold dark:text-neutral-400'>{t('add_ingredients')}</p>
                            </div>
                        )}
                    </div>
                </div>
                {/* Modal for cleaning pantry */}
                <ConfirmationModal
                    isOpen={cleanPantryModalIsOpen}
                    onCancel={() => setCleanPantryModalIsOpen(false)}
                    onConfirm={handleCleanPantry}
                    loading={cleanPantryLoading}
                    title={t('modal_cleanpantry_title')}
                    subtitle={t('modal_cleanpantry_subtitle')}
                    cancelText={t('modal_cleanpantry_cancel')}
                    confirmText={t('modal_cleanpantry_confirm')}
                />
                {/* Modal for adding new ingredient */}
                <ReactModal
                    isOpen={addIngredientModalIsOpen}
                    onRequestClose={() => {
                        setAddIngredientModalIsOpen(false);
                        setAddIngredientLoading(false);
                        setAddingIngredient(false);
                    }}
                    contentLabel="Add Ingredient Modal"
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    overlayClassName="fixed inset-0 bg-black/30 backdrop-blur-sm"
                    shouldCloseOnOverlayClick={true}
                    shouldCloseOnEsc={true}
                    ariaHideApp={false}
                >
                    <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6 m-4">
                        <h2 className="text-2xl font-bold text-center text-neutral-800 dark:text-white">
                            {t('add_ingredient')}
                        </h2>

                        {/* Ingredient Selector */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                {t('ingredient')}
                            </label>
                            <Listbox
                                value={addValues.ingredient}
                                onChange={(value) => {
                                    setAddValues({ ...addValues, ingredient: value });
                                    setSearchTerm(""); // limpia búsqueda al seleccionar
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
                                                    className={`no-scrollbar absolute z-50 bg-white dark:bg-neutral-800 rounded-md shadow-md border dark:border-neutral-700 mt-1 w-[80%] md:w-[45%] lg:w-[20%] ${ingredientList.length > 9 ? 'h-89' : 'h-fit'} overflow-auto`}
                                                    static
                                                    as={motion.div}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                >
                                                    {/* Input de búsqueda */}
                                                    <div className="px-3 py-2 sticky top-0 bg-white dark:bg-neutral-800 z-10">
                                                        <input
                                                            type="text"
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            placeholder={t('search')}
                                                            className="w-full px-2 py-1 text-sm border rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white ring-0 focus:ring-0 focus:outline-none focus:border-blue-500"
                                                        />
                                                    </div>

                                                    {/* Opciones filtradas */}
                                                    {filteredIngredients.length > 0 ? (
                                                        filteredIngredients.map((option) => (
                                                            <ListboxOption
                                                                key={option.id}
                                                                value={option}
                                                                className="px-4 py-2 cursor-pointer text-sm hover:bg-blue-100 dark:hover:bg-neutral-700 dark:text-white"
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

                        {/* Quantity and Unit Inputs */}
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                    {t('quantity')}
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={addValues.quantity || ''}
                                    onChange={(e) => {
                                        const value = Math.min(Number(e.target.value), 99999);
                                        setAddValues({ ...addValues, quantity: value });
                                    }}
                                    className="w-full p-2 rounded-md border dark:border-neutral-700 dark:bg-neutral-700 dark:text-white bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                    {t('unit')}
                                </label>
                                <select
                                    value={t(addValues.unit) || unitOptions[0]}
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

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-neutral-900 dark:bg-neutral-600 dark:text-white dark:hover:bg-neutral-500"
                                onClick={() => {
                                    setAddIngredientModalIsOpen(false);
                                    setAddIngredientLoading(false);
                                    setAddingIngredient(false);
                                }}
                                disabled={addingIngredient}
                            >
                                {t('cancel')}
                            </button>
                            <button
                                className={`px-4 py-2 flex rounded-md ${isAddDisabled ? 'bg-blue-900 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                    } text-white`}
                                onClick={handleAddIngredientToPantry}
                                disabled={isAddDisabled || addingIngredient}
                            >
                                {addingIngredient ? (
                                    <MoonLoader size={18} />
                                ) : (
                                    t('add')
                                )}
                            </button>

                        </div>
                    </div>
                </ReactModal>

            </div>
        )
    );
}
export default Pantry;