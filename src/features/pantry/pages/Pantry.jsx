import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getUserPantry, cleanIngredientPantry, getIngredientList, addIngredientPantry } from '@/features/auth/services/authService';
import ContentLoader from '@/shared/components/ContentLoader';
import ConfirmationModal from '@/shared/components/ConfirmationModal';
import AddIngredientModal from '@/features/pantry/components/AddIngredientModal';
import IngredientItem from '@/features/pantry/components/IngredientItem';
import PantryHeaderButtons from '@/features/pantry/components/PantryHeaderButtons';



const Pantry = () => {
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

    // Ingredient deleting actions
    const [deletingIngredientId, setDeletingIngredientId] = useState(null);

    // Ingredient editing actions
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [editingIngredientId, setEditingIngredientId] = useState(null);
    const [confirmEditingIngredient, setConfirmEditingIngredient] = useState(false);

    // Ingredient search actions
    const [searchIngredient, setSearchIngredient] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPantry = Array.isArray(userPantry)
        ? userPantry.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) : [];

    // Values for the ingredient being added
    const [addValues, setAddValues] = useState({});

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
                setAddValues({ ingredient: null, quantity: '', unit: 'unit_gr' });
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
                unit: addValues.unit ? addValues.unit : 'unit_gr'
            };
            const response = await addIngredientPantry(ingredient);
            if (response) {
                setUserPantry(prevPantry => (Array.isArray(prevPantry) ? [...prevPantry, ingredient] : [ingredient]));
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

    // TODO: Add translations
    return (
        loading ? (
            <ContentLoader />
        ) : (
            <div className="flex flex-col items-center justify-center h-screen w-full p-2 md:p-4">
                <div className="w-full h-full rounded-lg p-4 xl:p-6 2xl:p-8 bg-stone-50 dark:bg-neutral-800 shadow-md">
                    <PantryHeaderButtons
                        pantryLength={userPantry.length}
                        addIngredientLoading={addIngredientLoading}
                        cleanPantryLoading={cleanPantryLoading}
                        handleAddIngredient={handleAddIngredient}
                        setCleanPantryModalIsOpen={setCleanPantryModalIsOpen}
                        toggleSearchIngredient={setSearchIngredient}
                        addingIngredient={addingIngredient}
                        shouldBeDisabled={deletingIngredientId !== null || editingIngredientId !== null}
                        t={t}
                    />
                    <div className="flex flex-col items-center justify-start w-full h-full">
                        {/* Search ingredient */}
                        {searchIngredient && (
                            <div className="flex flex-col items-start justify-center w-full h-fit mb-2">
                                <input
                                    type="text"
                                    placeholder={t('search_ingredient')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full md:w-2/4 p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-neutral-700 dark:text-white"
                                />
                            </div>
                        )}
                        {/* Pantry items */}
                        {Array.isArray(userPantry) && userPantry.length > 0 ? (
                            <ul className="w-full divide-y dark:divide-gray-200 overflow-y-auto mb-12">
                                {filteredPantry.map((item) => (
                                    <IngredientItem
                                        key={item.ingredient_id}
                                        ingredient={item}
                                        userPantry={userPantry}
                                        setUserPantry={setUserPantry}
                                        onDeleteClick={() => handleDeleteIngredient(item.ingredient_id)}
                                        editingIngredient={editingIngredient}
                                        setEditingIngredient={setEditingIngredient}
                                        editingIngredientId={editingIngredientId}
                                        setEditingIngredientId={setEditingIngredientId}
                                        confirmEditingIngredient={confirmEditingIngredient}
                                        setConfirmEditingIngredient={setConfirmEditingIngredient}
                                        deletingIngredientId={deletingIngredientId}
                                        setDeletingIngredientId={setDeletingIngredientId}
                                        t={t}
                                    />
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
                <AddIngredientModal
                    isOpen={addIngredientModalIsOpen}
                    onClose={() => {
                        setAddIngredientModalIsOpen(false);
                        setAddIngredientLoading(false);
                        setAddingIngredient(false);
                    }}
                    onSubmit={handleAddIngredientToPantry}
                    ingredientList={ingredientList}
                    loading={addingIngredient}
                    addValues={addValues}
                    setAddValues={setAddValues}
                    t={t}
                />


            </div>
        )
    );
}
export default Pantry;