import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getIngredientList } from '@/features/auth/services/authService';
import ContentLoader from '@/shared/components/ContentLoader';
import { Plus } from '@phosphor-icons/react';
import { InputText } from 'primereact/inputtext';

import { ReactCountryFlag } from 'react-country-flag'

import RecipeNameInput from '../components/RecipeNameInput';
import RecipeDescriptionInput from '../components/RecipeDescription';
import RecipeIngredient from '../components/RecipeIngredient';

const CreateRecipe = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
        watch,
        setValue,
        unregister
    } = useForm();
    const [loading, setLoading] = useState(true);
    const [ingredientList, setIngredientList] = useState([]);
    const [recipeIngredients, setRecipeIngredients] = useState([{ id: Date.now() }]);

    const handleAddIngredient = (e) => {
        e.preventDefault();
        setRecipeIngredients(prev => [...prev, { id: Date.now() }]);
    };
    const handleRemoveIngredient = (indexToRemove) => {
        unregister(`ingredients.${indexToRemove}`);

        setRecipeIngredients((prev) => {
            const updated = prev.filter((_, i) => i !== indexToRemove);

            return updated.map((item, newIndex) => ({ ...item, id: Date.now() + newIndex }));
        });
    };

    const onSubmit = data => console.log(data);

    useEffect(() => {
        async function fetchData() {
            try {
                const ingredientList = await getIngredientList();
                setIngredientList(ingredientList);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        loading ? (
            <ContentLoader />
        ) : (
            <div className="flex flex-col items-center justify-center h-screen w-full p-2 md:p-4">
                <div className="w-full h-full rounded-lg p-4 xl:p-6 2xl:p-8 bg-stone-50 dark:bg-neutral-800 shadow-md overflow-y-auto text-neutral-900 dark:text-neutral-200">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-center mb-4">
                            {t('recipes.create.title')}
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
                        {/* Input for recipe name */}
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='recipeName' className='text-sm font-semibold'>
                                {t('recipes.create.name')}
                            </label>
                            <div className='flex flex-1 flex-col md:flex-row gap-4'>
                                <RecipeNameInput language="es" register={register} errors={errors} t={t} />
                                <RecipeNameInput language="gb" register={register} errors={errors} t={t} />
                            </div>
                        </div>


                        {/* Input for recipe description */}
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='recipeDescriptionSpanish' className='text-sm font-semibold'>
                                {t('recipes.create.description')}
                            </label>
                            <div className='flex flex-col md:flex-row gap-4'>
                                <RecipeDescriptionInput language="es" register={register} errors={errors} t={t} />
                                <RecipeDescriptionInput language="gb" register={register} errors={errors} t={t} />
                            </div>
                        </div>


                        {/* Input for recipe ingredients */}
                        <div id='ingredientList' className='flex flex-col gap-4'>
                            <div className='flex flex-row items-center justify-between sm:justify-start gap-6'>
                                <label htmlFor='recipeIngredients' className='text-sm font-semibold'>
                                    {t('recipes.create.ingredients')}
                                </label>
                                <button id='addIngredient' className='bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-400 transition duration-200' onClick={handleAddIngredient}>
                                    <Plus size={20} weight='bold' />
                                </button>
                            </div>
                            {/* Renderiza múltiples RecipeIngredient */}
                            {recipeIngredients.map((ingredient, index) => (
                                <RecipeIngredient
                                    key={ingredient.id}
                                    index={index}
                                    ingredientList={ingredientList}
                                    register={register}
                                    errors={errors}
                                    watch={watch}
                                    setValue={setValue}
                                    isSubmitted={isSubmitted}
                                    onRemove={handleRemoveIngredient}
                                    unregister={unregister}
                                />
                            ))}
                        </div>

                        <input
                            type='submit'
                            value={t('recipes.create.submit')}
                            className='bg-neutral-900 text-white p-2 rounded-md cursor-pointer hover:bg-neutral-800 transition duration-200'
                        />
                    </form>
                </div>
            </div>
        )
    );
}

export default CreateRecipe;