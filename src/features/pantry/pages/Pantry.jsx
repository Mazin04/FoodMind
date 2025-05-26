import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getUserPantry, cleanIngredientPantry, getIngredientList, addIngredientPantry } from '@/features/auth/services/authService';
import ContentLoader from '@/shared/components/ContentLoader';
import ConfirmationModal from '@/shared/components/ConfirmationModal';
import AddIngredientModal from '@/features/pantry/components/AddIngredientModal';
import IngredientItem from '@/features/pantry/components/IngredientItem';
import PantryHeaderButtons from '@/features/pantry/components/PantryHeaderButtons';
import InfiniteScroll from 'react-infinite-scroll-component';



const Pantry = () => {
    const { t } = useTranslation();

    const [userPantry, setUserPantry] = useState([]);
    const [ingredientList, setIngredientList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const perPage = 20;

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

    // Values for the ingredient being added
    const [addValues, setAddValues] = useState({});

    const filteredPantry = Array.isArray(userPantry)
        ? userPantry.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    useEffect(() => {
        fetchPantry(1);
    }, []);

    const fetchPantry = async (page) => {
        try {
            const response = await getUserPantry(page, perPage);
            const items = Object.values(response.data);
            if (page === 1) {
                setUserPantry(items);
            } else {
                console.log("Adding items to pantry:", items);
                setUserPantry((prev) => [...prev, ...items]);
            }
            setCurrentPage(response.current_page);
            setHasMore(response.current_page < response.last_page);
        } catch (error) {
            console.error("Error fetching pantry:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddIngredient = async () => {
        setAddIngredientLoading(true);
        if (ingredientList.length === 0) {
            try {
                const list = await getIngredientList();
                setIngredientList(list);
                setAddValues({ ingredient: null, quantity: '', unit: 'unit_gr' });
                setAddIngredientModalIsOpen(true);
            } catch (error) {
                console.error("Error fetching ingredient list:", error);
            }
        } else {
            setAddIngredientModalIsOpen(true);
        }
        setAddIngredientLoading(false);
    };

    const handleAddIngredientToPantry = async () => {
        setAddingIngredient(true);
        try {
            const ingredient = {
                ingredient_id: addValues.ingredient.id,
                name: addValues.ingredient.name,
                quantity: parseFloat(addValues.quantity),
                unit: addValues.unit || 'unit_gr',
            };
            const response = await addIngredientPantry(ingredient);
            if (response) {
                setUserPantry(prev => [...prev, ingredient]);
                setAddValues({});
            }
        } catch (error) {
            console.error("Error adding ingredient to pantry:", error);
        } finally {
            setAddingIngredient(false);
            setAddIngredientModalIsOpen(false);
        }
    };

    const handleCleanPantry = async () => {
        setCleanPantryModalIsOpen(false);
        setCleanPantryLoading(true);
        try {
            const response = await cleanIngredientPantry();
            if (response) {
                setUserPantry([]);
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error cleaning pantry:", error);
        } finally {
            setCleanPantryLoading(false);
        }
    };

    // TODO: Add translations
    return loading ? (
        <ContentLoader />
    ) : (
        <div className="flex flex-col items-center justify-start w-full h-full p-2 md:p-4">
            <div className="w-full max-w-5xl h-full rounded-lg p-4 xl:p-6 bg-stone-50 dark:bg-neutral-800 shadow-md">
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

                {/* Search Bar */}
                {searchIngredient && (
                    <div className="w-full mt-4 mb-2">
                        <input
                            type="text"
                            placeholder={t('search_ingredient')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-2/4 p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-neutral-700 dark:text-white"
                        />
                    </div>
                )}

                {/* Scrollable Pantry List */}
                <div
                    id="pantryScroll"
                    className="w-full max-h-[calc(100vh-150px)] overflow-y-auto"
                >
                    {filteredPantry.length !== 0 ? (
                        <InfiniteScroll
                            dataLength={userPantry.length}
                            scrollableTarget="pantryScroll"
                            style={{ overflow: 'hidden' }}
                            next={async () => {
                                if (!hasMore) return;
                                try {
                                    console.log(currentPage);
                                    await fetchPantry(currentPage + 1);
                                } catch (error) {
                                    console.error("Error fetching more pantry items:", error);
                                }
                            }}
                            hasMore={hasMore}
                            loader={<ContentLoader />}
                        >
                            <ul className="divide-y dark:divide-gray-200">
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
                        </InfiniteScroll>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-40 space-y-2">
                            <p className="text-neutral-800 text-lg font-bold dark:text-white">{t('empty_pantry')}</p>
                            <p className="text-neutral-500 font-semibold dark:text-neutral-400">{t('add_ingredients')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
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
    );

}
export default Pantry;