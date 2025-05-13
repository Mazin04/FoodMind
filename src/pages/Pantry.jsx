import { useEffect, useState } from 'react';
import ContentLoader from '@/components/ContentLoader';
import { useTranslation } from 'react-i18next';
import { getUserPantry, deleteIngredientPantry, cleanIngredientPantry } from '@/services/authService';
import { Trash, PencilSimple, Plus } from '@phosphor-icons/react';
import { MoonLoader } from "react-spinners";
import ConfirmationModal from '@/components/ConfirmationModal';


const Pantry = () => {
    // TODO: Add modal & all translations to db

    const { t } = useTranslation();

    const [userPantry, setUserPantry] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pantry cleaning actions
    const [cleanPantryModalIsOpen, setCleanPantryModalIsOpen] = useState(false);
    const [cleanPantryLoading, setCleanPantryLoading] = useState(false);

    const [deleteIngredientLoading, setDeleteIngredientLoading] = useState(false);

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
        setDeleteIngredientLoading(true);
        try {
            const response = await deleteIngredientPantry(ingredientId);
            if (response) {
                setUserPantry(userPantry.filter(item => item.id !== ingredientId));
            }
        } catch (error) {
            console.error("Error deleting ingredient:", error);
        } finally {
            setDeleteIngredientLoading(false);
        }
    }



    return (
        loading ? (
            <ContentLoader />
        ) : (
            <div className="flex flex-col items-center justify-center h-screen w-full p-2 md:p-4">
                <div className="w-full h-full rounded-lg p-4 xl:p-6 2xl:p-8 bg-white dark:bg-neutral-800 shadow-md">
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
                            <ul className="w-full divide-y divide-gray-200 overflow-y-auto mb-12">
                                {userPantry.map((item, index) => (
                                    <li key={item.id} className="dark:bg-neutral-800 dark:hover:bg-neutral-700 hover:bg-stone-300 p-4 flex justify-between items-center space-x-10">
                                        <span className="text-neutral-900 dark:text-white font-bold">{item.name}</span>
                                        <div className='flex flex-row items-center justify-between space-x-6'>
                                            <span className="text-neutral-500 dark:text-neutral-400">{item.quantity} {t(item.unit)}</span>
                                            <div className='flex flex-col space-y-2'>
                                                <button className="text-blue-500 hover:text-blue-700 transition duration-200">
                                                    <PencilSimple size={20} />
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-700 flex transition duration-200"
                                                    disabled={deleteIngredientLoading}
                                                    onClick={() => handleDeleteIngredient(item.id)}
                                                >
                                                    {deleteIngredientLoading ? (
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
                            <div className='flex flex-col items-center justify-center w-full h-full space-y-4'>
                                <p className="text-neutral-800 dark:text-white">{t('empty_pantry')}</p>
                                <p className='text-neutral-500 dark:text-neutral-400'>{t('add_ingredients')}</p>
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
// TODO: Add modal translations to db
export default Pantry;