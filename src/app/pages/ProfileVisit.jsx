import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import useScrollHorizontal from '@/shared/lib/scrollHorizontal';
import RecipeCard from "@/features/recipes/components/RecipeCard";
import bg from "@/assets/images/backgrounds/bg-2.png";
import ContentLoader from "@/shared/components/ContentLoader.jsx";
import { getUserById, getPublicRecipesByUser } from '@/features/auth/services/authService';

const ProfileVisit = () => {
    const { t } = useTranslation();
    const scrollRef = useScrollHorizontal();
    const navigate = useNavigate();
    const { id } = useParams();

    const [userName, setUserName] = useState("User");
    const [, setAvatar] = useState(null);
    const [date, setDate] = useState("");
    const [placeholder, setPlaceholder] = useState(null);
    const [finalAvatar, setFinalAvatar] = useState(null);

    const [loading, setLoading] = useState(true);

    const [userCreatedRecipes, setUserCreatedRecipes] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const user = await getUserById(id);
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
                const recipes = await getPublicRecipesByUser(id);
                setUserCreatedRecipes(Array.isArray(recipes) ? recipes : []);
            } catch (error) {

            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <>
            {loading ? (
                <ContentLoader />
            ) : (
                <div className="h-full w-full flex flex-col items-center justify-start text-neutral-900 dark:text-white">
                    <div
                        className="relative min-h-52 sm:min-h-72 md:min-h-84 w-full border-b-1 border-neutral-700 dark:border-neutral-500 mb-6 sm:mb-8 lg:mb-10 xl:mb-12"
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
                    {Array.isArray(userCreatedRecipes) && userCreatedRecipes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full p-5 overflow-auto no-scrollbar relative">
                            {userCreatedRecipes.map((recipe) => (
                                <RecipeCard recipe={recipe} key={recipe.id} />
                            ))}
                        </div>
                    ) : (
                        <div className="h-max flex flex-col items-center justify-center mt-4 md:mt-6 xl:mt-8 w-full px-5 overflow-auto no-scrollbar space-y-2">
                            <p className="text-lg font-bold">{t("profilevisit.norecipescreated")}</p>
                            <p className="text-sm text-gray-500">{t("profilevisit.norecipescreateddesc")}</p>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default ProfileVisit;