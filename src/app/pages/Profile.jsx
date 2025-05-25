import { useEffect, useState } from "react";
import { getUser, userRecipes, userFavorites as getUserFavorites } from "@/features/auth/services/authService";
import { useTranslation } from "react-i18next";
import useScrollHorizontal from "@/shared/lib/scrollHorizontal";
import RecipeCard from "@/features/recipes/components/RecipeCard";

import bg from "@/assets/images/backgrounds/bg-2.png";
import ContentLoader from "@/shared/components/ContentLoader.jsx";
import InfiniteScroll from "react-infinite-scroll-component";

const Profile = () => {
    const { t } = useTranslation();
    const scrollRef = useScrollHorizontal();

    const [userName, setUserName] = useState("User");
    const [, setAvatar] = useState(null);
    const [date, setDate] = useState("");
    const [placeholder, setPlaceholder] = useState(null);
    const [finalAvatar, setFinalAvatar] = useState(null);
    const [currentMethodUserCreated, setCurrentMethodUserCreated] = useState(true);
    const [loading, setLoading] = useState(true);
    const [tabLoading, setTabLoading] = useState(false);

    const [hasMoreCreated, setHasMoreCreated] = useState(true);
    const [hasMoreFavorites, setHasMoreFavorites] = useState(true);
    const [currentPageCreated, setCurrentPageCreated] = useState(1);
    const [currentPageFavorites, setCurrentPageFavorites] = useState(1);
    const perPage = 12;

    const [userCreatedRecipes, setUserCreatedRecipes] = useState([]);
    const [userFavorites, setUserFavorites] = useState([]);

    const displayedRecipes = Array.isArray(currentMethodUserCreated ? userCreatedRecipes : userFavorites)
        ? (currentMethodUserCreated ? userCreatedRecipes : userFavorites)
        : [];

    useEffect(() => {

        async function fetchData() {
            try {
                const user = await getUser();
                const placeholderUrl = `https://avatar.iran.liara.run/username?username=${user.name}`;
                const avatarUrl = user.avatar && user.avatar.trim() !== "" ? user.avatar : null;

                setUserName(user.name);
                document.title = "Foodmind - " + user.name;
                const options = { day: "2-digit", month: "short", year: "numeric" };
                const formattedDate = new Date(user.created_at).toLocaleString("es-ES", options).replace(",", "");
                setDate(formattedDate);
                setPlaceholder(placeholderUrl);
                setAvatar(avatarUrl);
                setFinalAvatar(avatarUrl || placeholderUrl);
                setCurrentMethodUserCreated(true);
                await fetchUserCreatedRecipes(1);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const fetchUserCreatedRecipes = async (page) => {
        try {
            var response;
            response = await userRecipes(page, perPage);
            if (page === 1) {
                setUserCreatedRecipes(response.data);
            } else {
                setUserCreatedRecipes((prevRecipes) => [...prevRecipes, ...response.data]);
            }
            setCurrentPageCreated(response.current_page);
            setHasMoreCreated(response.current_page < response.last_page);
        } catch (error) {
            console.error("Error fetching user created recipes:", error);
        }
    };

    const fetchUserFavorites = async (page) => {
        try {
            var response;
            response = await getUserFavorites(page, perPage);
            if (page === 1) {
                setUserFavorites(response.data);
            } else {
                setUserFavorites((prevFavorites) => [...prevFavorites, ...response.data]);
            }
            setCurrentPageFavorites(response.current_page);
            setHasMoreFavorites(response.current_page < response.last_page);
        } catch (error) {
            console.error("Error fetching user favorites:", error);
        }
    };

    const handleShowMyRecipes = async () => {
        setTabLoading(true);
        setCurrentMethodUserCreated(true);
        setUserCreatedRecipes([]);
        setCurrentPageCreated(1);
        setHasMoreCreated(true);
        await fetchUserCreatedRecipes(1);
        setTabLoading(false);
    };

    const handleShowFavorites = async () => {
        setTabLoading(true);
        setCurrentMethodUserCreated(false);
        setUserFavorites([]);
        setCurrentPageFavorites(1);
        setHasMoreFavorites(true);
        await fetchUserFavorites(1);
        setTabLoading(false);
    };


    return (
        <>
            {loading ? (
                <ContentLoader />
            ) : (
                <div className="h-full w-full flex flex-col items-center justify-start text-neutral-900 dark:text-white">
                    <div
                        className="relative min-h-32 sm:min-h-72 md:min-h-84 w-full border-b-1 border-neutral-700 dark:border-neutral-500 mb-4"
                        style={{
                            backgroundImage: `url(${bg})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        <div className="absolute inset-0 bg-black/50" /> {/* Opcional overlay semitransparente */}

                        <div className="absolute bottom-[-25px] md:bottom-[-40px] left-5 md:left-10 z-20 w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-white bg-gray-200">
                            {!loading && finalAvatar && (
                                <img
                                    src={finalAvatar}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover transition-opacity duration-500 opacity-0 not-draggable"
                                    onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
                                    onError={(e) => {
                                        if (e.target.src !== placeholder) {
                                            setFinalAvatar(placeholder);
                                        }
                                    }}
                                />
                            )}
                        </div>

                        <p className="absolute bottom-0 left-20 md:left-40 text-white font-bold text-md md:text-lg lg:text-xl xl:text-2xl p-1 bg-black/50 px-10 rounded-tr-xl">
                            {userName}
                        </p>
                        <p className="absolute bottom-[-21px] md:bottom-[-29px] xl:bottom-[-37px] left-20 md:left-30 text-white font-bold text-sm lg:text-md xl:text-lg p-1 bg-black/50 py-0 md:py-1 pl-10 md:pl-20 pr-5 rounded-br-xl">
                            {date}
                        </p>
                    </div>
                    <div className="flex flex-col items-start justify-center mt-8 md:mt-10 xl:mt-12 w-full">
                        <div id="tabs" className="flex flex-row items-start justify-start md:justify-center w-full px-5 space-x-4 overflow-auto no-scrollbar" ref={scrollRef}>
                            <h1
                                className={`text-lg md:text-xl font-bold text-center cursor-pointer ${currentMethodUserCreated ? "border-b-2 border-blue-500" : "border-b-2 border-transparent"
                                    }`}
                                onClick={handleShowMyRecipes}
                            >
                                {t("profile.myrecipes")}
                            </h1>
                            <h1
                                className={`text-lg md:text-xl font-bold text-center cursor-pointer ${!currentMethodUserCreated ? "border-b-2 border-blue-500" : "border-b-2 border-transparent"
                                    }`}
                                onClick={handleShowFavorites}
                            >
                                {t("profile.favoriterecipes")}
                            </h1>
                        </div>
                        <hr className="w-full border-neutral-700 dark:border-neutral-500 mt-1.5" />
                    </div>
                    <div id="recipeGrid" className="w-full overflow-auto no-scrollbar">
                        {tabLoading ? (
                            <div className="p-12 w-full flex justify-center">
                                <ContentLoader />
                            </div>
                        ) : displayedRecipes.length !== 0 ? (
                            <InfiniteScroll
                                dataLength={displayedRecipes.length}
                                scrollableTarget="recipeGrid"
                                style={{ overflow: 'hidden' }}
                                next={async () => {
                                    if (currentMethodUserCreated) {
                                        if (!hasMoreCreated) return;
                                        try {
                                            await fetchUserCreatedRecipes(currentPageCreated + 1);
                                        } catch (error) {
                                            console.error("Error fetching more created recipes:", error);
                                        }
                                    } else {
                                        if (!hasMoreFavorites) return;
                                        try {
                                            await fetchUserFavorites(currentPageFavorites + 1);
                                        } catch (error) {
                                            console.error("Error fetching more favorite recipes:", error);
                                        }
                                    }
                                }}
                                hasMore={currentMethodUserCreated ? hasMoreCreated : hasMoreFavorites}
                                loader={
                                    <>
                                        <div className='p-12'><ContentLoader /></div>
                                        {hasMoreCreated || hasMoreFavorites ? (
                                            <p className="text-center text-gray-500 dark:text-gray-400 p-4">
                                                {t('home.loadingMore')}
                                            </p>
                                        ) : null}
                                    </>
                                }
                                endMessage={
                                    <p className="text-center text-gray-500 dark:text-gray-400 p-4">
                                        {t('home.endMessage')}
                                    </p>
                                }
                            >
                                <div id="recipeGrid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full p-5">
                                    {displayedRecipes.map((recipe) => (
                                        <RecipeCard recipe={recipe} key={recipe.id} />
                                    ))}
                                </div>
                            </InfiniteScroll>
                        ) : (
                            <div className="h-max flex flex-col items-center justify-center mt-4 md:mt-6 xl:mt-8 w-full px-5 overflow-auto no-scrollbar space-y-2">
                                {currentMethodUserCreated ? (
                                    <>
                                        <p className="text-lg font-bold">{t("profile.norecipescreated")}</p>
                                        <p className="text-sm text-gray-500">{t("profile.norecipescreateddesc")}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-lg font-bold">{t("profile.nofavoriterecipes")}</p>
                                        <p className="text-sm text-gray-500">{t("profile.nofavoriterecipesdesc")}</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Profile;