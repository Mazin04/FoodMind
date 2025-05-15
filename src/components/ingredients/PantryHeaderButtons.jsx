// components/PantryHeaderButtons.jsx
import { Plus, Trash, MagnifyingGlass } from '@phosphor-icons/react';
import { MoonLoader } from "react-spinners";

const PantryHeaderButtons = ({
    pantryLength,
    setCleanPantryModalIsOpen,
    addIngredientLoading,
    cleanPantryLoading,
    handleAddIngredient,
    addingIngredient,
    shouldBeDisabled,
    toggleSearchIngredient,
    t
}) => {
    const handleOpenModalCleanPantry = () => {
        // Open modal to confirm cleaning pantry
        setCleanPantryModalIsOpen(true);
    }

    return (
        <div className="flex flex-row items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-neutral-800 dark:text-white">{t('title_pantry')}</h1>
            <div className="flex justify-end items-center space-x-2 md:space-x-4">
                <button
                    className="bg-blue-500 flex text-white p-1 md:p-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:cursor-not-allowed disabled:bg-blue-900 disabled:text-stone-400"
                    onClick={handleAddIngredient}
                    disabled={addIngredientLoading || addingIngredient || shouldBeDisabled}
                >
                    {addIngredientLoading || addingIngredient ? (
                        <MoonLoader size={18} />
                    ) : (
                        <Plus size={24} />
                    )}
                </button>
                {/* Can clean pantry ingredients if there's any */}
                {pantryLength > 0 && (
                    <>
                        <button
                            className='bg-green-500 text-white flex p-1 md:p-2 rounded-md hover:bg-green-700 transition duration-200 disabled:cursor-not-allowed disabled:bg-green-900 disabled:text-stone-400'
                            onClick={() => toggleSearchIngredient((prev) => !prev)}
                            disabled={addIngredientLoading || addingIngredient || shouldBeDisabled}
                        >
                            {addingIngredient ? (
                                <MoonLoader size={18} />
                            ) : (
                                <MagnifyingGlass size={24} />
                            )}
                        </button>
                        <button
                            className="bg-red-500 text-white flex p-1 md:p-2 rounded-md hover:bg-red-700 transition duration-200 disabled:cursor-not-allowed disabled:bg-red-900 disabled:text-stone-400"
                            onClick={handleOpenModalCleanPantry}
                            disabled={cleanPantryLoading || addingIngredient || shouldBeDisabled || addIngredientLoading}
                        >
                            {cleanPantryLoading ? (
                                <MoonLoader size={18} />
                            ) : (
                                <Trash size={24} />
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PantryHeaderButtons;
