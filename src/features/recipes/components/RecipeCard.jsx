import { t } from "i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Heart } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { addRecipeToFavorites, removeRecipeFromFavorites } from "@/features/recipes/services/recipeService";

const RecipeCard = ({ recipe }) => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [ingredients_match, setIngredientsMatch] = useState("");
    const [stepsCount, setStepsCount] = useState(0);
    const [types, setTypes] = useState([]);
    const [favorite, setFavorite] = useState(false);


    useEffect(() => {
        setName(recipe.name);
        setDescription(recipe.description);
        setFavorite(recipe.is_favourite);
        setImage(recipe.image);
        setIngredientsMatch(recipe.ingredients_match);
        setStepsCount(recipe.steps_count);
        setTypes(recipe.types);
    }, [recipe]);

    const handleClick = () => {
        navigate(`/recipe/${recipe.id}`);
    };

    const getMatchIcon = () => {
        switch (ingredients_match) {
            case "NO TIENE":
            case "MISSING":
                return {
                    icon: "❌",
                    tooltipLabel: t('recipe_donthave'),
                };
            case "UNIDADES DISTINTAS":
            case "DIFFERENT UNITS":
                return {
                    icon: "⚠️",
                    tooltipLabel: t('recipe_differentunits')
                };
            case "NO SUFICIENTE":
            case "NOT ENOUGH":
                return {
                    icon: "❗",
                    tooltipLabel: t('recipe_notenough')
                };
            case "PUEDE HACERLO":
            case "CAN MAKE":
                return {
                    icon: "✅",
                    tooltipLabel: t('recipe_canmake')
                };
            default:
                return {
                    icon: "❓",
                    tooltipLabel: t('recipe_unknown')
                };
        }
    }

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

    const { icon, tooltipLabel } = getMatchIcon();
    return (
        <div
            className="flex flex-col items-center justify-start w-full h-full bg-white dark:bg-neutral-800 rounded-lg shadow-md cursor-pointer max-h-[360px]"
        >
            <div className="relative w-full h-115 overflow-hidden rounded-t-lg">
                <img
                    src={image}
                    alt={name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-t-lg not-draggable cursor-pointer"
                    onClick={handleClick}
                />
                <Heart
                    size={30}
                    weight={favorite ? 'fill' : 'duotone'}
                    className="absolute top-2 left-2 text-red-500 cursor-pointer focus:outline-none"
                    onClick={handleFavoriteClick}
                />
                <span
                    id={`tooltip-${recipe.id}`}
                    className="absolute top-2 right-2 bg-blue-500/80 text-white text-sm font-semibold p-1 rounded-lg"
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
            </div>

            <div className="flex flex-col items-start justify-between p-4 w-full h-full" onClick={handleClick}>
                <div className="flex flex-col items-start w-full">
                    <div className="flex items-center justify-between w-full mb-2">
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{name}</h2>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            {stepsCount} {localStorage.getItem('i18nextLng') === 'es' ? 'pasos' : 'steps'}
                        </span>
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2 text-justify leading-6">{description}</p>
                </div>

                <div className="flex w-full overflow-x-auto whitespace-nowrap space-x-2 mt-2">
                    {types.map((type, index) => (
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