import { useEffect, useState } from 'react';
import ContentLoader from '@/components/ContentLoader';
import { useTranslation } from 'react-i18next';
import { getUserPantry, deleteIngredientPantry, cleanIngredientPantry, editIngredientPantry } from '@/services/authService';
import { Trash, PencilSimple, Plus, Check } from '@phosphor-icons/react';
import { MoonLoader } from "react-spinners";
import ConfirmationModal from '@/components/ConfirmationModal';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'


const Pantry = () => {
    // TODO: Unit translations to db

    const unitOptions = ['unit_gr', 'unit_ml', 'unit_u'];

    const { t } = useTranslation();

    const [userPantry, setUserPantry] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pantry cleaning actions
    const [cleanPantryModalIsOpen, setCleanPantryModalIsOpen] = useState(false);
    const [cleanPantryLoading, setCleanPantryLoading] = useState(false);

    const [deletingIngredientId, setDeletingIngredientId] = useState(null);
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [editingIngredientId, setEditingIngredientId] = useState(null);
    const [confirmEditingIngredient, setConfirmEditingIngredient] = useState(false);
    const [editedValues, setEditedValues] = useState({});

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

    const handleAddIngredient = () => {
        // Open modal to add new ingredient
        console.log('Add new ingredient');
    }

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
                setUserPantry(userPantry.filter(item => item.id !== ingredientId));
            }
        } catch (error) {
            console.error("Error deleting ingredient:", error);
        } finally {
            setDeletingIngredientId(null);
        }
    }

    const handleEditIngredient = (ingredientId) => {
        const ingredient = userPantry.find(item => item.id === ingredientId);
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
                        item.id === ingredientId
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
                                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
                                onClick={handleAddIngredient}
                            >
                                <Plus size={24} />
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
                                    <li key={item.id} className={` p-4 flex justify-between items-center space-x-10 ${editingIngredient && editingIngredientId === item.id ? 'dark:bg-neutral-900 bg-stone-200' : 'dark:bg-neutral-800 dark:hover:bg-neutral-700 hover:bg-stone-300'}`}>
                                        <span className="text-neutral-900 dark:text-white font-bold">{item.name}</span>
                                        <div className='flex flex-row items-center justify-between space-x-6'>
                                            {editingIngredientId === item.id ? (
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
                                                    disabled={editingIngredient && editingIngredientId !== item.id}
                                                >
                                                    {editingIngredientId === item.id && editingIngredient ? (
                                                        confirmEditingIngredient ? (
                                                            <MoonLoader color="#00c951" size={16} />
                                                        ) : (
                                                            <Check size={20} className='text-green-500' onClick={() => confirmEditIngredient(item.id)} />
                                                        )
                                                    ) : (
                                                        <PencilSimple size={20}
                                                            onClick={() => {
                                                                handleEditIngredient(item.id);
                                                            }} />
                                                    )}
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-700 flex transition duration-200"
                                                    disabled={deletingIngredientId === item.id}
                                                    onClick={() => handleDeleteIngredient(item.id)}
                                                >
                                                    {deletingIngredientId === item.id ? (
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
            </div>
        )
    );
}
export default Pantry;