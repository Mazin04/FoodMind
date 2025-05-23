import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";

// Icons
import { TiTick } from "react-icons/ti";
import { IoCloseSharp } from "react-icons/io5";
import { IoIosWarning } from "react-icons/io";
import { FaExclamationCircle, FaLock, FaLockOpen } from "react-icons/fa";
import { GrStatusUnknown } from "react-icons/gr";
import { Heart, ShareNetwork, Trash } from "@phosphor-icons/react";
import { FaFilePdf } from "react-icons/fa6";


// Services & Components
import { getRecipeById, addRecipeToFavorites, removeRecipeFromFavorites, makeRecipePrivate, makeRecipePublic, deleteRecipe } from "@/features/recipes/services/recipeService";
import { getUser } from "@/features/auth/services/authService";
import PageLoader from "@/shared/components/PageLoader";
import ShareModal from "@/shared/components/ShareModal";
import { exportToPdf } from "@/shared/lib/exportToPdf";
import ConfirmationModal from '@/shared/components/ConfirmationModal';

import URLS from '@/constants/urls.js';

const getMatchIcon = (match, width, t) => {
    const size = width < 640 ? 24 : 32;
    switch (match) {
        case "NO TIENE":
        case "MISSING":
            return { icon: <IoCloseSharp size={size} className="text-red-500" />, tooltipLabel: t('recipe_donthave') };
        case "UNIDADES DISTINTAS":
        case "DIFFERENT UNITS":
            return { icon: <IoIosWarning size={size} className="text-yellow-500" />, tooltipLabel: t('recipe_differentunits') };
        case "NO SUFICIENTE":
        case "NOT ENOUGH":
            return { icon: <FaExclamationCircle size={size} className="text-orange-500" />, tooltipLabel: t('recipe_notenough') };
        case "PUEDE HACERLO":
        case "CAN MAKE":
            return { icon: <TiTick size={size} className="text-green-500" />, tooltipLabel: t('recipe_canmake') };
        default:
            return { icon: <GrStatusUnknown size={size} className="text-gray-500" />, tooltipLabel: t('recipe_unknown') };
    }
};

const RecipeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [userID, setUserID] = useState(null);
    const [recipe, setRecipe] = useState(null);
    const [favorite, setFavorite] = useState(false);
    const [is_private, setIsPrivate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
    const [shareModalIsOpen, setShareModalIsOpen] = useState(false);
    const [deleteRecipeModalIsOpen, setDeleteRecipeModalIsOpen] = useState(false);
    const [deleteRecipeLoading, setDeleteRecipeLoading] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const user = await getUser();
                setUserID(user.id);
                const data = await getRecipeById(id);
                if (!data || data.error) {
                    navigate(URLS.HOME);
                    return;
                }
                setRecipe(data);
                setFavorite(data.is_favourite);
                setIsPrivate(data.is_private);
                console.log("Recipe data:", data);
                document.title = "Foodmind - " + data.name;
            } catch (error) {
                console.error("Error fetching recipe:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id, navigate]);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleFavoriteClick = async (e) => {
        e.stopPropagation();
        try {
            if (favorite) {
                setFavorite(false);
                const result = await removeRecipeFromFavorites(id);
                if (!result || result.error) setFavorite(true);
            } else {
                setFavorite(true);
                const result = await addRecipeToFavorites(id);
                if (!result || result.error) setFavorite(false);
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
            setFavorite(!favorite); // revert on error
        }
    };

    const handlePrivateClick = async (e) => {
        e.stopPropagation();
        try {
            if (is_private) {
                setIsPrivate(false);
                const result = await makeRecipePublic(id);
                if (!result || result.error) setIsPrivate(true);
            } else {
                setIsPrivate(true);
                const result = await makeRecipePrivate(id);
                if (!result || result.error) setIsPrivate(false);
            }
        } catch (error) {
            console.error("Error updating privacy:", error);
            setIsPrivate(!is_private); // revert on error
        }
    }

    const handleDeleteRecipe = async () => {
        console.log("Deleting recipe...");
        setDeleteRecipeLoading(true);
        try {
            const result = await deleteRecipe(id);
            if (result && !result.error) {
                navigate(URLS.HOME);
            } else {
                console.error("Error deleting recipe:", result.error);
            }
        } catch (error) {
            console.error("Error deleting recipe:", error);
        } finally {
            setDeleteRecipeLoading(false);
            setDeleteRecipeModalIsOpen(false);
        }
    }

    const { icon, tooltipLabel } = useMemo(() => {
        return getMatchIcon(recipe?.ingredients_match, windowWidth, t);
    }, [recipe?.ingredients_match, windowWidth, t]);

    if (loading || !recipe) return <PageLoader />;

    const { name, description, image, ingredients = [], steps = [], types = [] } = recipe;

    return (
        <>
            <div className="h-full w-full flex flex-col items-center justify-start text-neutral-900 dark:text-white">
                <img src={image} alt={name || "Recipe"} className="w-full h-1/3 object-cover shadow-md shadow-black/80 dark:shadow-white/30 min-h-[200px] lg:min-h-[400px] rounded-b-sm not-draggable" />

                {/* Head Section */}
                <div className="flex flex-col lg:flex-row sm:items-center items-start space-y-2 sm:space-y-3 lg:space-y-0 justify-between w-full p-4">
                    <div className="flex flex-col items-start space-y-2 w-full">
                        <h1 className="text-2xl font-bold w-full">{name.charAt(0).toUpperCase() + name.slice(1)}</h1>
                        <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 cursor-pointer hover:underline underline-offset-2"
                            onClick={() => navigate(`/profile/${recipe.creator.id}`)}>
                            {t('created_by')} {recipe.creator.name.charAt(0).toUpperCase() + recipe.creator.name.slice(1)}
                        </h2>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <div className="flex flex-row items-center lg:justify-end space-x-3 sm:space-x-4 min-h-14">
                            <button id={`tooltip-${id}`} className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition">
                                {icon}
                            </button>
                            <Tooltip anchorSelect={`#tooltip-${id}`} place="bottom-end" style={{ position: "absolute", zIndex: 9999 }} content={tooltipLabel} />
                            <button id={`tooltip-private${id}`} className="p-2 sm:p-3 rounded-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition" onClick={handlePrivateClick} disabled={recipe.creator.id !== userID}>
                                {is_private ? (
                                    <FaLock size={24} className="text-gray-500" />
                                ) : (
                                    <FaLockOpen size={24} className="text-gray-500" />
                                )}
                            </button>
                            {recipe.creator.id === userID ? (
                                <button className="p-2 sm:p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition" onClick={() => setDeleteRecipeModalIsOpen(true)}>
                                    <Trash size={windowWidth < 640 ? 24 : 32} className="text-red-500 cursor-pointer" />
                                </button>
                            ) : null}
                            <Tooltip anchorSelect={`#tooltip-private${id}`} place="bottom-end" style={{ position: "absolute", zIndex: 9999 }} content={is_private ? t('recipe_private') : t('recipe_public')} />
                            <button className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition" onClick={handleFavoriteClick}>
                                <Heart size={windowWidth < 640 ? 24 : 32} weight={favorite ? 'fill' : 'duotone'} className="text-red-500 cursor-pointer" />
                            </button>
                            <button className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition" onClick={() => setShareModalIsOpen(true)}>
                                <ShareNetwork size={windowWidth < 640 ? 24 : 32} weight="duotone" className="text-blue-500 cursor-pointer" />
                            </button>
                            <button className="p-2 sm:p-3 rounded-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition" onClick={() => exportToPdf(recipe)}>
                                <FaFilePdf size={24} className="text-red-500 cursor-pointer" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="w-full h-full overflow-y-auto flex flex-col items-start space-y-4 pb-4">
                    {/* Types */}
                    <div className="overflow-x-auto overflow-hidden min-h-12 flex flex-row items-center space-x-4 w-full py-2 px-4 bg-neutral-100 dark:bg-neutral-900">
                        {types.map((type, idx) => (
                            <div key={idx} className="flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 rounded-full px-4 py-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition">
                                <span className="text-sm font-semibold">{type}</span>
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col w-full px-4 space-y-2">
                        <h2 className="text-lg font-bold">{t('recipe_description')}</h2>
                        <p className="text-sm text-neutral-700 dark:text-neutral-400">{description}</p>
                    </div>

                    {/* Ingredients */}
                    <div className="flex flex-col w-full px-4 space-y-2">
                        <h2 className="text-lg font-bold">{t('recipe_ingredients')}</h2>
                        <ul className="space-y-2">
                            {ingredients.map((ing, i) => (
                                <li key={i} className="flex space-x-2">
                                    <span className="font-semibold text-sm">{ing.name.charAt(0).toUpperCase() + ing.name.slice(1)}:</span>
                                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                        {ing.unit === 'taste'
                                            ? t(ing.unit).charAt(0).toUpperCase() + t(ing.unit).slice(1)
                                            : `${parseFloat(ing.quantity) % 1 === 0 ? parseInt(ing.quantity) : parseFloat(ing.quantity).toFixed(2)} ${t(ing.unit)}`}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Steps */}
                    <div className="flex flex-col w-full px-4 space-y-2">
                        <h2 className="text-lg font-bold">{t('recipe_steps')}</h2>
                        <ul className="space-y-2">
                            {steps.map((step, i) => (
                                <li key={i} className="flex flex-col sm:flex-row flex-nowrap space-y-2 space-x-2 w-full">
                                    <span className="font-semibold text-sm whitespace-nowrap flex-shrink-0">
                                        {t('recipe_step')} {i + 1}:
                                    </span>
                                    <span className="text-sm text-neutral-500 dark:text-neutral-400 break-words w-full">
                                        {step}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <ShareModal
                isOpen={shareModalIsOpen}
                onClose={() => setShareModalIsOpen(false)}
            />

            <ConfirmationModal
                isOpen={deleteRecipeModalIsOpen}
                onCancel={() => setDeleteRecipeModalIsOpen(false)}
                onConfirm={handleDeleteRecipe}
                title={t('delete_recipe')}
                subtitle={t('delete_recipe_subtitle')}
                cancelText={t('cancel')}
                confirmText={t('confirm')}
                message={t('delete_recipe_message')}
                loading={deleteRecipeLoading}
            />
        </>
    );
};

export default RecipeDetails;
