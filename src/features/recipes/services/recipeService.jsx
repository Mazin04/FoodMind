import instance from '@/shared/lib/axios';
import { notifyService } from '@/shared/services/notifyService';

const withCSRF = async () => {
    try {
        await instance.get('/sanctum/csrf-cookie');
    } catch (error) {
        if (error.response && error.response.status === 401) {
            notifyService.error("Session expired, please login again", { duration: 2000 });
        } else {
            notifyService.error("Can't connect with the server", { duration: 2000 });
        }
        throw error;
    }
}

/**
 * @description This function is used to add a recipe to the user's favorites.
 * It sends a POST request to the server with the recipe ID and the user's language preference.
 * @param {int} recipeId 
 * @returns 
 */
export const addRecipeToFavorites = async (recipeId) => {
    try {
        const lang = localStorage.getItem('i18nextLng') || 'es';
        await withCSRF();
        const { data } = await instance.post(`/api/recipes/${recipeId}/favourite`, {
            withCredentials: true,
            withXSRFToken: true,
            headers: { 'Content-Type': 'application/json' },
            lang,
        });
        notifyService.success(data.message, { duration: 4000 });
        return data;       
    } catch (error) {
        notifyService.error(error.response.data.error, { duration: 3000 });
        console.error(error.response.data.error);
        return (error.response.data);
    }
}

/**
 * @description This function is used to remove a recipe from the user's favorites.
 * It sends a DELETE request to the server with the recipe ID and the user's language preference.
 * @param {int} recipeId
 * @returns 
 */
export const removeRecipeFromFavorites = async (recipeId) => {
    try {
        const lang = localStorage.getItem('i18nextLng') || 'es';
        await withCSRF();
        const { data } = await instance.delete(`/api/recipes/${recipeId}/favourite`, {
            withCredentials: true,
            withXSRFToken: true,
            headers: { 'Content-Type': 'application/json' },
            params: { lang },
        });
        notifyService.success(data.message, { duration: 4000 });
        return data;
    } catch (error) {
        notifyService.error(error, { duration: 2000 });
        console.error(error);
        return (error.response.data);
    }
}

/**
 * @description This function is used to get a recipe by its ID.
 * It sends a GET request to the server with the recipe ID and the user's language preference.
 * @param {int} recipeId
 * @returns
 */
export const getRecipeById = async (recipeId) => {
    try {
        const lang = localStorage.getItem('i18nextLng') || 'es';
        const { data } = await instance.get(`/api/recipes/${recipeId}`, {
            withCredentials: true,
            withXSRFToken: true,
            headers: { 'Content-Type': 'application/json' },
            params: { lang },
        });
        return data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            notifyService.error(error.response.data.error, { duration: 3000 });
            return error.response.data;
        } else if (error.response && error.response.status === 403) {
            notifyService.error(error.response.data.error, { duration: 3000 });
            return null;
        }
    }
}

/**
 * @description This function is used to make a recipe public.
 * It sends a POST request to the server with the recipe ID and the user's language preference.
 * @param {int} recipeId
 * @returns
 */
export const makeRecipePublic = async (recipeId) => {
    try {
        const lang = localStorage.getItem('i18nextLng') || 'es';
        await withCSRF();
        const { data } = await instance.post(`/api/recipes/${recipeId}/public`, {
            withCredentials: true,
            withXSRFToken: true,
            headers: { 'Content-Type': 'application/json' },
            params: { lang },
        });
        notifyService.success(data.message, { duration: 4000 });
        return data;
    } catch (error) {
        notifyService.error(error, { duration: 2000 });
        console.error(error);
        return (error.response.data);
    }
}

/**
 * @description This function is used to make a recipe private.
 * It sends a POST request to the server with the recipe ID and the user's language preference.
 * @param {int} recipeId
 * @returns
 */
export const makeRecipePrivate = async (recipeId) => {
    try {
        const lang = localStorage.getItem('i18nextLng') || 'es';
        await withCSRF();
        const { data } = await instance.post(`/api/recipes/${recipeId}/private`, {
            withCredentials: true,
            withXSRFToken: true,
            headers: { 'Content-Type': 'application/json' },
            params: { lang },
        });
        notifyService.success(data.message, { duration: 4000 });
        return data;
    } catch (error) {
        notifyService.error(error, { duration: 2000 });
        console.error(error);
        return (error.response.data);
    }
}

/**
 * @description This function is used to delete a recipe by its ID.
 * It sends a DELETE request to the server with the recipe ID and the user's language preference.
 * @param {int} recipeId
 * @returns
 */
export const deleteRecipe = async (recipeId) => {
    try {
        const lang = localStorage.getItem('i18nextLng') || 'es';
        await withCSRF();
        const { data } = await instance.delete(`/api/recipes/${recipeId}`, {
            withCredentials: true,
            withXSRFToken: true,
            headers: { 'Content-Type': 'application/json' },
            lang,
        });
        notifyService.success(data.message, { duration: 4000 });
        return data;
    } catch (error) {
        notifyService.error(error.response.data.message, { duration: 2000 });
        return (error.response.data);
    }
}