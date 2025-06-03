import instance from '@/shared/lib/axios';
import { notifyService } from '@/shared/services/notifyService';

const getLang = () => localStorage.getItem('i18nextLng') || 'es';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const withCSRF = async () => {
  try {
    await instance.get('/sanctum/csrf-cookie');
  } catch (error) {
    const status = error.response?.status;
    const msg = status === 401 ? "Session expired, please login again" : "Can't connect with the server";
    notifyService.error(msg, { duration: 2000 });
    throw error;
  }
};

const handleError = (error, fallbackMsg = "An error occurred") => {
  const msg = error.response?.data?.message || error.response?.data?.error || fallbackMsg;
  notifyService.error(msg, { duration: 3000 });
  console.error(error);
  return error.response?.data;
};

const makeRequest = async (method, url, data = {}, isForm = false) => {
  try {
    await withCSRF();
    const lang = getLang();
    const config = {
      method,
      url,
      withCredentials: true,
      withXSRFToken: true,
      headers: isForm ? { 'Content-Type': 'multipart/form-data' } : defaultHeaders,
      ...(method === 'get' || method === 'delete' ? { params: { lang } } : {}),
      ...(method !== 'get' && method !== 'delete' ? { data: isForm ? data : { ...data, lang } } : {}),
    };

    const response = await instance.request(config);
    notifyService.success(response.data.message || response.data.success, { duration: 4000 });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// === Exported API Functions ===

export const addRecipeToFavorites = (recipeId) => makeRequest('post', `/api/recipes/${recipeId}/favourite`, {});
export const removeRecipeFromFavorites = (recipeId) => makeRequest('delete', `/api/recipes/${recipeId}/favourite`);
export const makeRecipePublic = (recipeId) => makeRequest('post', `/api/recipes/${recipeId}/public`, {});
export const makeRecipePrivate = (recipeId) => makeRequest('post', `/api/recipes/${recipeId}/private`, {});
export const deleteRecipe = (recipeId) => makeRequest('delete', `/api/recipes/${recipeId}`);

export const getRecipeById = async (recipeId) => {
  try {
    const lang = getLang();
    const { data } = await instance.get(`/api/recipes/${recipeId}`, {
      withCredentials: true,
      withXSRFToken: true,
      headers: defaultHeaders,
      params: { lang },
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const getRecipeTypes = async () => {
  try {
    const lang = getLang();
    const { data } = await instance.post('/api/recipes/types', {}, {
      withCredentials: true,
      withXSRFToken: true,
      headers: defaultHeaders,
      params: { lang },
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const createRecipe = (formData) => makeRequest('post', '/api/recipes', formData, true);

export const getPublicRecipes = async (page, perPage = 21) => {
  try {
    const lang = getLang();
    const { data } = await instance.post('/api/recipes/available', {
      page,
      perPage,
      lang,
    }, {
      withCredentials: true,
      withXSRFToken: true,
      headers: defaultHeaders,
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const getRecipesByName = async (name, page, perPage = 21) => {
  try {
    const lang = getLang();
    const { data } = await instance.post('/api/recipes/byName', {
      name,
      page,
      perPage,
      lang,
    }, {
      withCredentials: true,
      withXSRFToken: true,
      headers: defaultHeaders,
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
};
