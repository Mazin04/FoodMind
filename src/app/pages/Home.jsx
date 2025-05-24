import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import RecipeCard from '@/features/recipes/components/RecipeCard';
import ContentLoader from '@/shared/components/ContentLoader.jsx';
import { getPublicRecipes } from '@/features/recipes/services/recipeService';

const Home = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const perPage = 21;

    const fetchRecipes = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const data = await getPublicRecipes(page, perPage);
            if (data?.data?.length === 0) {
                setHasMore(false);
            } else {
                setRecipes(prev => [...prev, ...data.data]);
                setPage(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error loading recipes:', error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

    useEffect(() => {
        fetchRecipes();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !loading && hasMore) {
                fetchRecipes();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchRecipes, loading, hasMore]);

    return (
        <div className="flex flex-col items-start justify-start w-full h-full">
            {/* Search bar and title */}
            <div className="w-full max-w-4xl p-4">
                <div className='flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between items-baseline'>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                        {t('home.title')}
                    </h1>
                    <h2 className="text-lg text-neutral-700 dark:text-neutral-300">
                        {t('home.subtitle')}
                    </h2>
                </div>
            </div>

            {/* Recipes grid */}
            <div className="w-full max-w-2xl p-4">
                <input
                    type="text"
                    placeholder={t('home.searchPlaceholder')}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
                />
            </div>

            <div id='recipeGrid' className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full p-5 overflow-auto">
                {recipes.map((recipe) => (
                    <RecipeCard recipe={recipe} key={recipe.id} />
                ))}
            </div>

            {/* Loader at bottom while fetching first batch of recipes */}
            {loading && (
                <div className="w-full flex items-center justify-center py-4">
                    <ContentLoader />
                </div>
            )}
        </div>
    );
};

export default Home;
