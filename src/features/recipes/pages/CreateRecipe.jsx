import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getIngredientList } from '@/features/auth/services/authService';
import { getRecipeTypes, createRecipe } from '@/features/recipes/services/recipeService';
import ContentLoader from '@/shared/components/ContentLoader';
import { Plus } from '@phosphor-icons/react';
import { Checkbox } from '@headlessui/react'
import URLS from '@/constants/urls';

import RecipeNameInput from '../components/RecipeNameInput';
import RecipeDescriptionInput from '../components/RecipeDescription';
import RecipeIngredient from '../components/RecipeIngredient';
import RecipeStepInput from '../components/RecipeStepInput';
import ImageUpload from '../components/ImageUpload';
import ReactSelectMulti from '../components/ReactSelectMulti';

const CreateRecipe = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
        watch,
        setValue,
        control,
        unregister
    } = useForm();
    const [loading, setLoading] = useState(true);
    const [ingredientList, setIngredientList] = useState([]);
    const [recipeIngredients, setRecipeIngredients] = useState([{ id: Date.now() }]);
    const [recipeSteps, setRecipeSteps] = useState([{ id: Date.now() }]);
    const [recipeTypes, setRecipeTypes] = useState([]);

    const handleAddIngredient = (e) => {
        e.preventDefault();
        setRecipeIngredients(prev => [...prev, { id: Date.now() }]);
    };

    const handleAddSteps = (e) => {
        e.preventDefault();
        setRecipeSteps(prev => [...prev, { id: Date.now() }]);
    }

    const handleRemoveIngredient = (indexToRemove) => {
        unregister(`ingredients.${indexToRemove}`);

        setRecipeIngredients((prev) => {
            const updated = prev.filter((_, i) => i !== indexToRemove);

            return updated.map((item, newIndex) => ({ ...item, id: Date.now() + newIndex }));
        });
    };

    const handleRemoveStep = (indexToRemove) => {
        setRecipeSteps((prevSteps) => prevSteps.filter((_, i) => i !== indexToRemove));
    };

    const onSubmit = async (data) => {
        setLoading(true);
        // isPrivate: boolean a 0/1
        const is_private = data.isPrivate ? 1 : 0;

        // Nombres
        const names = [
            { language: 'es', name: data.recipeNameSpanish || '' },
            { language: 'en', name: data.recipeNameEnglish || '' },
        ];

        // Descripciones
        const descriptions = [
            { language: 'es', description: data.recipeDescriptionSpanish || '' },
            { language: 'en', description: data.recipeDescriptionEnglish || '' },
        ];

        // Ingredientes 
        const ingredients = data.ingredients.map(({ ingredient, quantity, unit }) => ({
            id: ingredient.id,
            quantity: quantity.toString(),
            unit,
        }));

        // Pasos
        const steps = [];
        data.steps.forEach((stepObj, index) => {
            if (stepObj.es) {
                steps.push({ language: 'es', order: index + 1, step: stepObj.es });
            }
            if (stepObj.en) {
                steps.push({ language: 'en', order: index + 1, step: stepObj.en });
            }
        });

        // Tipos
        const types = data.types.map(type => type.id);

        // Imagen
        const imageFile = data.image?.[0] || null;

        // Preparar payload para enviar a backend
        const formData = new FormData();
        formData.append('is_private', is_private);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        names.forEach((item, index) => {
            formData.append(`names[${index}][language]`, item.language);
            formData.append(`names[${index}][name]`, item.name);
        });
        descriptions.forEach((item, index) => {
            formData.append(`descriptions[${index}][language]`, item.language);
            formData.append(`descriptions[${index}][description]`, item.description);
        });
        ingredients.forEach((item, index) => {
            formData.append(`ingredients[${index}][id]`, item.id);
            formData.append(`ingredients[${index}][quantity]`, item.quantity);
            formData.append(`ingredients[${index}][unit]`, item.unit);
        });
        steps.forEach((item, index) => {
            formData.append(`steps[${index}][language]`, item.language);
            formData.append(`steps[${index}][order]`, item.order);
            formData.append(`steps[${index}][step]`, item.step);
        });
        types.forEach((id) => {
            formData.append('types[]', id);
        });

        try {
            for (const pair of formData.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }
            const response = await createRecipe(formData);
            if (response.success) {
                navigate(URLS.PROFILE);
            }
        } catch (error) {
            console.error('Error creating recipe:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const ingredientList = await getIngredientList();
                setIngredientList(ingredientList);
                const recipeTypes = await getRecipeTypes();
                setRecipeTypes(recipeTypes);
                console.log(recipeTypes);
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

                        {/* Input for recipe steps */}
                        <div id='recipeSteps' className='flex flex-col gap-4'>
                            <div className='flex flex-row items-center justify-between sm:justify-start gap-6'>
                                <label htmlFor='recipeSteps' className='text-sm font-semibold'>
                                    {t('recipes.create.steps')}
                                </label>
                                <button id='addStep' className='bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-400 transition duration-200' onClick={handleAddSteps}>
                                    <Plus size={20} weight='bold' />
                                </button>
                            </div>
                            {/* Renderiza múltiples RecipeSteps */}
                            {recipeSteps.map((step, index) => (
                                <RecipeStepInput
                                    key={step.id}
                                    index={index}
                                    register={register}
                                    errors={errors}
                                    t={t}
                                    onRemove={handleRemoveStep}
                                />
                            ))}
                        </div>

                        {/* Input para los tipos de la receta */}
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='recipeTypes' className='text-sm font-semibold'>
                                {t('recipes.create.types')}
                            </label>

                            <Controller
                                name='types'
                                control={control}
                                rules={{
                                    required: {
                                        value: true,
                                        message: t('recipes.create.typesRequired')
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <ReactSelectMulti
                                        options={recipeTypes}
                                        value={value}
                                        onChange={onChange}
                                        placeholder={t('recipes.create.typesPlaceholder')}
                                        error={errors.types}
                                    />
                                )}
                            />
                            {errors.types && (
                                <span className="text-red-500 text-xs">{errors.types.message || t('recipes.create.typesRequired')}</span>
                            )}
                        </div>

                        {/* Check for recipe is private */}
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='isPrivate' className='text-sm font-semibold'>
                                {t('recipes.create.isPrivate')}
                            </label>
                            <div className='flex flex-row items-center gap-2'>
                                <Checkbox
                                    checked={watch('isPrivate')}
                                    onChange={(e) => {
                                        setValue('isPrivate', e);
                                    }}
                                    className='group block size-6 data-checked:bg-blue-500 border dark:border-neutral-700 dark:bg-neutral-800 dark:text-white rounded-md'
                                >
                                    {/* Checkmark icon */}
                                    <svg className="stroke-white opacity-0 group-data-checked:opacity-100" viewBox="0 0 14 14" fill="none">
                                        <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Checkbox>
                                <span className='text-sm text-neutral-500 dark:text-neutral-400'>
                                    {t('recipes.create.isPrivateDescription')}
                                </span>
                            </div>
                        </div>


                        {/* Input for recipe image */}
                        <ImageUpload register={register} errors={errors} t={t} watch={watch} />

                        {/* Submit button */}
                        <input
                            type='submit'
                            value={t('recipes.create.submit')}
                            className='bg-neutral-900 text-white p-2 rounded-md cursor-pointer hover:bg-neutral-800 transition duration-200'
                        />
                    </form>
                </div >
            </div >
        )
    );
}

export default CreateRecipe;