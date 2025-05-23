import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import RecipeCard from '@/features/recipes/components/RecipeCard';
import ContentLoader from '@/shared/components/ContentLoader.jsx';
import { getPublicRecipes } from '@/features/recipes/services/recipeService';
import InfiniteScroll from 'react-infinite-scroll-component';

const Home = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 21;

    useEffect(() => {
        document.title = "Foodmind - " + t('home.title');
        const firstFetch = async () => {
            setLoading(true);
            try {
                const response = await getPublicRecipes(1, perPage);
                setRecipes(response.data);
                setCurrentPage(response.current_page);
                setHasMore(response.current_page < response.last_page);
            } catch (error) {
                console.error("Error fetching initial recipes:", error);
            } finally {
                setLoading(false);
            }
        };

        firstFetch();
    }, []);


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

            <div id='recipeGrid' className="w-full p-5 overflow-auto">
                <InfiniteScroll
                    dataLength={recipes.length}
                    scrollableTarget="recipeGrid"
                    style={{ overflow: 'hidden' }}
                    next={async () => {
                        if (hasMore) {
                            try {
                                const nextPage = currentPage + 1;
                                const response = await getPublicRecipes(nextPage, perPage);
                                setRecipes((prevRecipes) => [...prevRecipes, ...response.data]);
                                setCurrentPage(response.current_page);
                                setHasMore(response.current_page < response.last_page);
                            } catch (error) {
                                console.error("Error fetching more recipes:", error);
                            }
                        }
                    }}
                    hasMore={hasMore}
                    loader={<ContentLoader />}
                    endMessage={
                        <p className="text-center text-gray-500 dark:text-gray-400 p-4">
                            {t('home.endMessage')}
                        </p>
                    }
                >

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
                        {/* Render recipes */}
                        {recipes.map((recipe) => (
                            <RecipeCard recipe={recipe} key={recipe.id} />
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default Home;
