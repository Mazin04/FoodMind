import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import RecipeCard from '@/features/recipes/components/RecipeCard';
import ContentLoader from '@/shared/components/ContentLoader.jsx';
import { getPublicRecipes, getRecipesByName } from '@/features/recipes/services/recipeService';
import InfiniteScroll from 'react-infinite-scroll-component';
import { debounce } from 'lodash';

const Home = () => {
    const { t } = useTranslation();
    const [recipes, setRecipes] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 21;
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Filter recipes based on search term
    useEffect(() => {
        document.title = "Foodmind - " + t('home.title');
    }, []);

    // Function to fetch recipes based on search term
    useEffect(() => {
        const handler = debounce(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 1000);

        handler();

        return () => {
            handler.cancel();
        }
    }, [searchTerm]);

    useEffect(() => {
        fetchRecipes(1, debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    const fetchRecipes = async (page, searchTerm = '') => {
        try {
            var response;
            if (searchTerm.trim() !== '') {
                response = await getRecipesByName(searchTerm, page, perPage);
            } else {
                response = await getPublicRecipes(page, perPage);
            }
            if (page === 1) {
                setRecipes(response.data);
            } else {
                setRecipes((prevRecipes) => [...prevRecipes, ...response.data]);
            }
            setCurrentPage(response.current_page);
            setHasMore(response.current_page < response.last_page);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    }

    return (
        <div className="flex flex-col items-start justify-start w-full h-full">
            {/* Search bar and title */}
            <div className="w-full p-4">
                <div className='flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center'>
                    <h1 className="text-3xl h-full font-bold text-neutral-900 dark:text-white">
                        {t('home.title')}
                    </h1>
                    <h2 className="text-lg h-full text-neutral-700 dark:text-neutral-300">
                        {t('home.subtitle')}
                    </h2>
                </div>
            </div>

            {/* Recipes grid */}
            <div className="w-full max-w-2xl px-4 pb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('home.searchPlaceholder')}
                    className="w-full p-2 border border-gray-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
                />

            </div>

            <div id='recipeGrid' className="w-full p-5 overflow-auto">
                {recipes && recipes.length > 0 ? (
                    <InfiniteScroll
                        dataLength={recipes.length}
                        scrollableTarget="recipeGrid"
                        style={{ overflow: 'hidden' }}
                        next={async () => {
                            if (!hasMore) return;
                            try {
                                await fetchRecipes(currentPage + 1, debouncedSearchTerm);
                            } catch (error) {
                                console.error("Error fetching more recipes:", error);
                            }
                        }}
                        hasMore={hasMore}
                        loader={<div className='p-12'><ContentLoader /></div>}
                        endMessage={
                            <p className="text-center text-gray-500 dark:text-gray-400 p-4">
                                {t('home.endMessage')}
                            </p>
                        }
                    >
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
                            {recipes.map((recipe) => (
                                <RecipeCard recipe={recipe} key={recipe.id} />
                            ))}
                        </div>
                    </InfiniteScroll>
                ) : recipes?.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400">
                            {debouncedSearchTerm ? t('home.noResults') : t('home.noRecipes')}
                        </p>
                    </div>
                ) : null}


            </div>
        </div>
    );
};

export default Home;
