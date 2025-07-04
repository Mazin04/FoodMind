import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { PencilSimple, Trash, Check } from '@phosphor-icons/react';
import { useState, useRef, useEffect } from 'react';
import { createPopper } from '@popperjs/core';
import { MoonLoader } from 'react-spinners';
import { editIngredientPantry, deleteIngredientPantry } from '@/features/auth/services/authService';

const IngredientItem = ({
    ingredient,
    userPantry, setUserPantry,
    editingIngredient, setEditingIngredient,
    editingIngredientId, setEditingIngredientId,
    confirmEditingIngredient, setConfirmEditingIngredient,
    deletingIngredientId, setDeletingIngredientId,
    t
}) => {
    const unitOptions = ['unit_gr', 'unit_ml', 'unit_u'];

    // Estado para edición
    const [editedValues, setEditedValues] = useState({});
    const buttonRef = useRef(null);
    const optionsRef = useRef(null);
    const popperInstanceRef = useRef(null);

    // Crear instancia Popper SOLO cuando se edita el ingrediente
    useEffect(() => {
        if (editingIngredientId === ingredient.ingredient_id && buttonRef.current && optionsRef.current) {
            if (popperInstanceRef.current) {
                popperInstanceRef.current.destroy();
            }

            popperInstanceRef.current = createPopper(buttonRef.current, optionsRef.current, {
                placement: 'bottom',
                modifiers: [
                    { name: 'offset', options: { offset: [0, 4] } },
                    { name: 'preventOverflow', options: { boundary: 'viewport' } },
                ],
            });
        }

        // Limpia Popper cuando deja de editar
        return () => {
            if (popperInstanceRef.current) {
                popperInstanceRef.current.destroy();
                popperInstanceRef.current = null;
            }
        };
    }, [editingIngredientId, ingredient.ingredient_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'quantity') {
            const num = Number(value);
            if (value === '') newValue = '';
            else if (isNaN(num)) newValue = '';
            else if (num < 1) newValue = 1;
            else if (num > 99999) newValue = 99999;
            else newValue = num;
        }

        setEditedValues(prev => ({ ...prev, [name]: newValue }));
    };

    const handleEditIngredient = (ingredientId) => {
        const ingredient = userPantry.find(item => item.ingredient_id === ingredientId);
        setEditingIngredientId(ingredientId);
        setEditingIngredient(true);
        setEditedValues({ quantity: ingredient.quantity, unit: ingredient.unit });
    };

    const confirmEditIngredient = async (ingredientId) => {
        setConfirmEditingIngredient(true);
        try {
            let quantity = editedValues.quantity === '' ? 1 : Number(editedValues.quantity);
            if (isNaN(quantity) || quantity < 1) quantity = 1;
            if (quantity > 99999) quantity = 99999;

            const response = await editIngredientPantry(ingredientId, {
                quantity,
                unit: editedValues.unit
            });

            if (response) {
                setUserPantry(prevPantry =>
                    prevPantry.map(item =>
                        item.ingredient_id === ingredientId
                            ? { ...item, quantity, unit: editedValues.unit }
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
    };

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
    };

    return (
        <li key={ingredient.ingredient_id} className={`p-4 flex justify-between items-center space-x-10 ${editingIngredient && editingIngredientId === ingredient.ingredient_id ? 'dark:bg-neutral-900 bg-stone-200' : 'dark:bg-neutral-800 dark:hover:bg-neutral-700 hover:bg-stone-300'}`}>
            <span className="text-neutral-900 dark:text-white font-bold">{ingredient.name}</span>
            <div className='flex flex-row items-center justify-center space-x-2'>
                {editingIngredientId === ingredient.ingredient_id ? (
                    <>
                        <div className='flex items-center space-x-4'>
                            <input
                                type='number'
                                name='quantity'
                                value={editedValues.quantity !== undefined ? editedValues.quantity : ingredient.quantity}
                                onChange={handleInputChange}
                                className="w-15 p-1 rounded-md border border-neutral-600 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                        <Listbox
                            value={editedValues.unit ?? unitOptions[0]}
                            onChange={(value) => setEditedValues({ ...editedValues, unit: value })}
                        >
                            <div className='relative'>
                                                            <ListboxButton ref={buttonRef} className="w-20 p-1 rounded-md border border-neutral-600 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white text-center">
                                {t(editedValues.unit) || t(ingredient.unit)}
                            </ListboxButton>
                            <ListboxOptions
                                ref={optionsRef}
                                className="absolute z-50 bg-white dark:bg-neutral-800 rounded-md border border-neutral-600 outline-none dark:border-neutral-700 shadow-lg max-h-60 w-20 overflow-auto cursor-pointer"
                            >
                                {unitOptions.map((unit) => (
                                    <ListboxOption
                                        key={unit}
                                        value={unit}
                                        className="p-2 dark:text-white dark:hover:bg-neutral-700 hover:bg-stone-300 border-b dark:border-neutral-700"
                                    >
                                        {t(unit)}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                            </div>

                        </Listbox>
                    </>
                ) : (
                    <span className="text-neutral-500 dark:text-neutral-400">
                        {parseFloat(ingredient.quantity) % 1 === 0
                            ? parseInt(ingredient.quantity)
                            : parseFloat(ingredient.quantity).toFixed(2)} {t(ingredient.unit)}
                    </span>
                )}
                <div className='flex flex-col space-y-2'>
                    <button
                        className="text-blue-500 flex hover:text-blue-700 transition duration-200 disabled:text-blue-900 disabled:cursor-not-allowed cursor-pointer"
                        disabled={editingIngredient && editingIngredientId !== ingredient.ingredient_id}
                    >
                        {editingIngredientId === ingredient.ingredient_id && editingIngredient ? (
                            confirmEditingIngredient ? (
                                <MoonLoader size={16} color='#00c951' />
                            ) : (
                                <Check size={20} className='text-green-500' onClick={() => confirmEditIngredient(ingredient.ingredient_id)} />
                            )
                        ) : (
                            <PencilSimple size={20} onClick={() => handleEditIngredient(ingredient.ingredient_id)} />
                        )}
                    </button>
                    <button
                        className='text-red-500 hover:text-red-700 flex transition duration-200 disabled:text-red-900 disabled:cursor-not-allowed cursor-pointer'
                        disabled={
                            deletingIngredientId !== null ||
                            editingIngredientId === ingredient.ingredient_id ||
                            (editingIngredient && editingIngredientId !== ingredient.ingredient_id) ||
                            confirmEditingIngredient
                        }
                        onClick={() => handleDeleteIngredient(ingredient.ingredient_id)}
                    >
                        {deletingIngredientId === ingredient.ingredient_id ? (
                            <MoonLoader color="#fb2c36" size={16} />
                        ) : (
                            <Trash size={20} />
                        )}
                    </button>
                </div>
            </div>
        </li>
    );
};

export default IngredientItem;
