// recipeService.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as recipeService from './recipeService';
import instance from '@/shared/lib/axios';
import { notifyService } from '@/shared/services/notifyService';

vi.mock('@/shared/lib/axios', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
        request: vi.fn(),
    }
}));

vi.mock('@/shared/services/notifyService', () => ({
    notifyService: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

beforeEach(() => {
    vi.clearAllMocks();
    instance.get.mockReset();
    instance.post.mockReset();
    instance.delete.mockReset();
    instance.request.mockReset();
});

describe('recipeService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('withCSRF', () => {
        it('calls CSRF endpoint successfully', async () => {
            instance.get.mockResolvedValueOnce({});
            instance.request.mockResolvedValueOnce({ data: { message: 'ok' } });
            const result = await recipeService.addRecipeToFavorites(1);
            expect(result).toEqual({ message: 'ok' });
            expect(instance.get).toHaveBeenCalledWith('/sanctum/csrf-cookie');
        });

        it('handles CSRF 401 error', async () => {
            const error = { response: { status: 401 } };
            instance.get.mockRejectedValueOnce(error);
            const result = await recipeService.addRecipeToFavorites(1);
            expect(result).toBeUndefined();
            expect(notifyService.error).toHaveBeenCalledWith(
                "Session expired, please login again",
                { duration: 2000 }
            );
        });

    });

    describe('makeRequest', () => {
        it('makes a successful POST request', async () => {
            instance.get.mockResolvedValueOnce({});
            instance.request.mockResolvedValueOnce({ data: { message: 'Added!' } });

            const result = await recipeService.addRecipeToFavorites(42);
            expect(result).toEqual({ message: 'Added!' });
            expect(notifyService.success).toHaveBeenCalledWith('Added!', { duration: 4000 });
        });

        it('handles server error', async () => {
            const error = { response: { data: { message: 'Oops' } } };
            instance.get.mockResolvedValueOnce({});
            instance.request.mockRejectedValueOnce(error);

            const result = await recipeService.addRecipeToFavorites(42);
            expect(notifyService.error).toHaveBeenCalledWith('Oops', { duration: 3000 });
            expect(result).toEqual(error.response.data);
        });
    });

    describe('getRecipeById', () => {
        it('returns recipe by ID', async () => {
            instance.get.mockResolvedValueOnce({ data: { id: 1, title: 'Pizza' } });
            const result = await recipeService.getRecipeById(1);
            expect(result).toEqual({ id: 1, title: 'Pizza' });
        });

        it('calls handleError and returns its value on error', async () => {
            const error = { response: { data: { message: 'fail' } } };
            instance.get.mockRejectedValueOnce(error);
            const result = await recipeService.getRecipeById(999);
            expect(notifyService.error).toHaveBeenCalledWith('fail', { duration: 3000 });
            expect(result).toEqual(error.response.data); // Cubre línea 105
        });
    });

    describe('createRecipe', () => {
        it('sends multipart/form-data', async () => {
            const formData = new FormData();
            formData.append('name', 'Tarta');

            instance.get.mockResolvedValueOnce({});
            instance.request.mockResolvedValueOnce({ data: { success: 'Creado' } });

            const result = await recipeService.createRecipe(formData);
            expect(result).toEqual({ success: 'Creado' });
            expect(instance.request).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: '/api/recipes',
                    data: formData,
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
            );
        });
    });

    describe('getPublicRecipes', () => {
        it('fetches paginated public recipes', async () => {
            instance.post.mockResolvedValueOnce({ data: { recipes: [], total: 0 } });

            const result = await recipeService.getPublicRecipes(1);
            expect(result).toEqual({ recipes: [], total: 0 });
        });
    });

    describe('getRecipesByName', () => {
        it('searches recipes by name', async () => {
            instance.post.mockResolvedValueOnce({ data: { results: [] } });

            const result = await recipeService.getRecipesByName('Pasta', 1);
            expect(result).toEqual({ results: [] });
        });
    });

    describe('getRecipeTypes', () => {
        it('returns types on success', async () => {
            instance.post.mockResolvedValueOnce({ data: ['type1', 'type2'] });
            const result = await recipeService.getRecipeTypes();
            expect(result).toEqual(['type1', 'type2']);
        });

        it('calls handleError and returns its value on error', async () => {
            const error = { response: { data: { message: 'fail' } } };
            instance.post.mockRejectedValueOnce(error);
            const result = await recipeService.getRecipeTypes();
            expect(notifyService.error).toHaveBeenCalledWith('fail', { duration: 3000 });
            expect(result).toEqual(error.response.data); // Cubre línea 124
        });
    });
});
