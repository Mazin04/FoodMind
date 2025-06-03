import instance from '@/shared/lib/axios';
import { notifyService } from '@/shared/services/notifyService';

const withCSRF = async () => {
    try {
        await instance.get('/sanctum/csrf-cookie');
    } catch (error) {
        if (error.response && error.response.status === 401) {
            notifyService.error("Session expired, please login again", { duration: 5000 });
        } else {
            notifyService.error("Can't connect with the server", { duration: 5000 });
        }
        throw error;
    }
}

export const login = async (email, password) => {
    try {
        await withCSRF();
        await instance.post('/api/login', {
            email,
            password,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            withXSRFToken: true,
        });
        return await getUser();
    } catch (error) {
        throw error;
    }
}

export const isEmailRegistered = async (email) => {
    try {
        await withCSRF();
        const { data } = await instance.get('/api/email/registered', {
            params: { email },
        });
        return data;
    } catch (error) {
        if (error.response && error.response.status === 422) {
            notifyService.error("Email already registered", { duration: 5000 });
        } else {
            notifyService.error("Can't connect with the server", { duration: 5000 });
        }
        throw error;
    }
}

export const registerUser = async (name, email, password) => {
    try {
        await withCSRF();
        await instance.post('/api/register', {
            name,
            email,
            password,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            withXSRFToken: true,
        });
        return await login(email, password);
    } catch (error) {
        if (error.response && error.response.status === 422) {
            notifyService.error("Email already registered", { duration: 5000 });
        } else {
            notifyService.error("Can't connect with the server", { duration: 5000 });
        }
        throw error;
    }
}

export const getUser = async (isMain) => {
    try {
        await withCSRF();
        const { data } = await instance.get('/api/user');
        return data;
    } catch (error) {
        if (!isMain) {
            if (error.response && error.response.status === 401) {
                notifyService.error("Session expired, please login again", { duration: 5000 });
            } else {
                notifyService.error("Can't connect with the server", { duration: 5000 });
            }
            throw error;
        }
    }
}

export const logout = async () => {
    try {
        await withCSRF();
        await instance.get('/api/logout');
    } catch (error) {
        notifyService.error("Can't connect with the server", { duration: 5000 });
        throw error;
    }
}

export const userRecipes = async (page, perPage = 12) => {
    try {
        const lang = localStorage.getItem('i18nextLng') || 'es';
        await withCSRF();
        const { data } = await instance.post('/api/user/yourRecipes', {
            withCredentials: true,
            withXSRFToken: true,
            headers: { 'Content-Type': 'application/json' },
            lang,
            page,
            perPage,
        });
        return data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            notifyService.error("Session expired, please login again", { duration: 5000 });
        } else {
            notifyService.error("Can't connect with the server", { duration: 5000 });
        }
        return error;
    }
}

export const userFavorites = async (page, perPage = 12) => {
    try {
        const lang = localStorage.getItem('i18nextLng') || 'es';
        await withCSRF();
        const { data } = await instance.post('/api/user/favourites', {
            withCredentials: true,
            withXSRFToken: true,
            headers: { 'Content-Type': 'application/json' },
            lang,
            page,
            perPage,
        });
        return data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            notifyService.error("Session expired, please login again", { duration: 5000 });
        } else {
            notifyService.error("Can't connect with the server", { duration: 5000 });
        }
        return error;
    }
}

export const getUserPantry = async (page = 1, perPage = 20) => {
    try {
        const lang = localStorage.getItem('i18nextLng') || 'es';
        await withCSRF();
        const { data } = await instance.get('/api/ingredients', {
            withCredentials: true,
            withXSRFToken: true,
            headers: { 'Content-Type': 'application/json' },
            params: { lang, page, perPage },
        });
        return data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            notifyService.error("Session expired, please login again", { duration: 5000 });
        } else {
            notifyService.error("Can't connect with the server", { duration: 5000 });
        }
        throw error;        
    }
}

export const deleteIngredientPantry = async (ingredientId) => {
    try {
        const lang = localStorage.getItem('i18nextLng') || 'es';
        await withCSRF();
        const { data } = await instance.delete(`/api/ingredients/${ingredientId}`, {
            withCredentials: true,
            withXSRFToken: true,
            headers: { 'Content-Type': 'application/json' },
            lang,
        });
        notifyService.success(data.message, { duration: 4000 });
        return data;
    } catch (error) {
        notifyService.error(error.response.data.message, { duration: 5000 });        
    }
}

export const cleanIngredientPantry = async () => {
    try {
        const lang = localStorage.getItem('i18nextLng') || 'es';
        await withCSRF();
        const { data } = await instance.delete('/api/ingredients', {
            withCredentials: true,
            withXSRFToken: true,
            headers: { 'Content-Type': 'application/json' },
            lang,
        });
        notifyService.success(data.message, { duration: 4000 });
        return data;    
    } catch (error) {
        notifyService.error(error.response.data.message, { duration: 5000 });
    }
}

export const editIngredientPantry = async (ingredientId, newValues) => {
    try {
        const lang = localStorage.getItem('i18nextLng') || 'es';
        await withCSRF();
        const { data } = await instance.put(`/api/ingredients/${ingredientId}`, {
            ...newValues,
            withCredentials: true,
            withXSRFToken: true,
            headers: { 'Content-Type': 'application/json' },
            lang,
        });
        notifyService.success(data.message, { duration: 4000 });
        return data;
    } catch (error) {
        notifyService.error(error.response.data.message, { duration: 5000 })
    }
}

export const getIngredientList = async () => {
    try {
        const lang = localStorage.getItem('i18nextLng') || 'es';
        await withCSRF();
        const { data } = await instance.get('/api/ingredients/list', {
            withCredentials: true,
            withXSRFToken: true,
            headers: { 'Content-Type': 'application/json' },
            params: { lang },
        });
        return data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            notifyService.error("Session expired, please login again", { duration: 5000 });
        } else {
            notifyService.error("Can't connect with the server", { duration: 5000 });
        }
        throw error;
    }
}

export const addIngredientPantry = async (ingredient) => {
    try {
        const lang = localStorage.getItem('i18nextLng') || 'es';
        await withCSRF();
        const { data } = await instance.post('/api/ingredients', {
            ...ingredient,
            withCredentials: true,
            withXSRFToken: true,
            headers: { 'Content-Type': 'application/json' },
            lang,
        });
        notifyService.success(data.message, { duration: 4000 });
        return data;
    } catch (error) {
        notifyService.error(error.response.data.message, { duration: 5000 });
        console.error(error);
    }
}

export const getPublicRecipesByUser = async (userId) => {
    try {
        const lang = localStorage.getItem('i18nextLng') || 'es';
        await withCSRF();
        const { data } = await instance.get(`/api/user/${userId}/public-recipes`, {
            withCredentials: true,
            withXSRFToken: true,
            headers: { 'Content-Type': 'application/json' },
            params: { lang },
        });
        return data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            notifyService.error("Session expired, please login again", { duration: 5000 });
        } else {
            notifyService.error("Can't connect with the server", { duration: 5000 });
        }
        return error;
    }
}

export const getUserById = async (userId) => {
    try {
        const lang = localStorage.getItem('i18nextLng') || 'es';
        await withCSRF();
        const { data } = await instance.get(`/api/user/${userId}`, {
            withCredentials: true,
            withXSRFToken: true,
            headers: { 'Content-Type': 'application/json' },
            params: { lang },
        });
        return data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            notifyService.error("Session expired, please login again", { duration: 5000 });
        } else {
            notifyService.error("Can't connect with the server", { duration: 5000 });
        }
        return error;
    }
}