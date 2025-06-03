import { t } from "i18next";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Heart } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { addRecipeToFavorites, removeRecipeFromFavorites } from "@/features/recipes/services/recipeService";
import { FaExclamationCircle, FaLock } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { IoIosWarning } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { GrStatusUnknown } from "react-icons/gr";

const RecipeCard = ({ recipe }) => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [ingredients_match, setIngredientsMatch] = useState("");
    const [stepsCount, setStepsCount] = useState(0);
    const [types, setTypes] = useState([]);
    const [favorite, setFavorite] = useState(false);
    const [hasError, setHasError] = useState(false);


    useEffect(() => {
        setName(recipe.name);
        setDescription(recipe.description);
        setFavorite(recipe.is_favourite);
        setImage(recipe.image);
        setIngredientsMatch(recipe.ingredients_match);
        setStepsCount(recipe.steps_count);
        setTypes(recipe.types);
        setHasError(false);
    }, [recipe]);

    const handleClick = () => {
        navigate(`/recipe/${recipe.id}`);
    };

    const getMatchIcon = (match, t) => {
        const size = 24;
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

    const handleFavoriteClick = async (e) => {
        e.stopPropagation();
        if (favorite) {
            try {
                setFavorite(false);
                await removeRecipeFromFavorites(recipe.id);
            } catch (error) {
                console.error("Error removing recipe from favorites:", error);
                setFavorite(true);
            }
        } else {
            try {
                setFavorite(true);
                await addRecipeToFavorites(recipe.id);
            } catch (error) {
                console.error("Error adding recipe to favorites:", error);
                setFavorite(false);
            }
        }
    }

    const { icon, tooltipLabel } = useMemo(() => {
        return getMatchIcon(ingredients_match, t);
    }, [ingredients_match, t]);

    return (
        <div
            className="flex flex-col items-center justify-start w-full h-full bg-blue-50 dark:bg-neutral-800 rounded-lg shadow-md cursor-pointer max-h-[360px]"
        >
            <div className="relative w-full h-115 overflow-hidden rounded-t-lg">
                {recipe.image !== null ? (
                    <img
                        src={image}
                        alt={name}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-t-lg not-draggable cursor-pointer"
                        onClick={handleClick}
                        onError={() => setHasError(true)}
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-lg font-semibold text-center p-4 rounded-t-lg"
                        onClick={handleClick}
                    >
                        {name}
                    </div>
                )}
                <Heart
                    size={30}
                    weight={favorite ? 'fill' : 'duotone'}
                    className="absolute top-2 left-2 text-red-500 cursor-pointer focus:outline-none"
                    onClick={handleFavoriteClick}
                />
                <span
                    id={`tooltip-${recipe.id}`}
                    className="absolute top-2 right-2 bg-black/80 text-white text-sm font-semibold p-1 rounded-full"
                >
                    {icon}
                </span>
                <Tooltip
                    key={recipe.id}
                    anchorSelect={`#tooltip-${recipe.id}`}
                    place="bottom-end"
                    style={{ position: "absolute", zIndex: 9999 }}
                    content={tooltipLabel}
                />
                {recipe.is_private && (
                    <div className="absolute left-2 bottom-2 w-fit h-fit p-2 rounded-full bg-black/80 dark:bg-neutral-800/80 shadow-md">
                        <FaLock size={15} className="text-white" />
                    </div>
                )}
            </div>

            <div className="flex flex-col items-start justify-between p-4 w-full h-full rounded-b-xl" onClick={handleClick}>
                <div className="flex flex-col items-start w-full">
                    <div className="flex items-center justify-between w-full mb-2">
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{name}</h2>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            {stepsCount} {localStorage.getItem('i18nextLng') === 'es' ? 'pasos' : 'steps'}
                        </span>
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2 text-justify w-full leading-6 break-words line-clamp-3">
                        {description}
                    </p>

                </div>

                <div className="flex w-full overflow-x-auto no-scrollbar whitespace-nowrap space-x-2 mt-2">
                    {Array.isArray(types) && types.map((type, index) => (
                        <span
                            key={index}
                            className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full items-center w-full text-center"
                        >
                            {type}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RecipeCard;