import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as authService from './authService';
import instance from '@/shared/lib/axios';
import { notifyService } from '@/shared/services/notifyService';

vi.mock('@/shared/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/shared/services/notifyService', () => ({
  notifyService: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.localStorage = {
      getItem: vi.fn(() => 'es'),
    };
  });

  describe('userFavorites', () => {
    it('should return favorite recipes data', async () => {
      instance.get.mockResolvedValueOnce({});
      instance.post.mockResolvedValueOnce({ data: ['favRecipe'] });
      const data = await authService.userFavorites(1, 12);
      expect(data).toEqual(['favRecipe']);
    });

    it('should notify on 401 error', async () => {
      instance.get.mockResolvedValueOnce({});
      const error = { response: { status: 401 } };
      instance.post.mockRejectedValueOnce(error);
      const result = await authService.userFavorites(1, 12);
      expect(notifyService.error).toHaveBeenCalledWith('Session expired, please login again', { duration: 5000 });
      expect(result).toBe(error);
    });
  });

  describe('getUserPantry', () => {
    it('should return pantry data', async () => {
      instance.get.mockResolvedValueOnce({});
      instance.get.mockResolvedValueOnce({ data: ['ingredient'] });
      const data = await authService.getUserPantry();
      expect(data).toEqual(['ingredient']);
    });

    it('should notify on 401 error', async () => {
      instance.get.mockResolvedValueOnce({});
      const error = { response: { status: 401 } };
      instance.get.mockRejectedValueOnce(error);
      await expect(authService.getUserPantry()).rejects.toBe(error);
      expect(notifyService.error).toHaveBeenCalledWith('Session expired, please login again', { duration: 5000 });
    });
  });

  describe('deleteIngredientPantry', () => {
    it('should notify success on deletion', async () => {
      instance.get.mockResolvedValueOnce({});
      instance.delete.mockResolvedValueOnce({ data: { message: 'Deleted' } });
      const data = await authService.deleteIngredientPantry(5);
      expect(data).toEqual({ message: 'Deleted' });
      expect(notifyService.success).toHaveBeenCalledWith('Deleted', { duration: 4000 });
    });

    it('should notify error on failure', async () => {
      instance.get.mockResolvedValueOnce({});
      const error = { response: { data: { message: 'Error' } } };
      instance.delete.mockRejectedValueOnce(error);
      await authService.deleteIngredientPantry(5);
      expect(notifyService.error).toHaveBeenCalledWith('Error', { duration: 5000 });
    });
  });

  describe('cleanIngredientPantry', () => {
    it('should notify success on cleaning', async () => {
      instance.get.mockResolvedValueOnce({});
      instance.delete.mockResolvedValueOnce({ data: { message: 'Cleaned' } });
      const data = await authService.cleanIngredientPantry();
      expect(data).toEqual({ message: 'Cleaned' });
      expect(notifyService.success).toHaveBeenCalledWith('Cleaned', { duration: 4000 });
    });

    it('should notify error on failure', async () => {
      instance.get.mockResolvedValueOnce({});
      const error = { response: { data: { message: 'Clean error' } } };
      instance.delete.mockRejectedValueOnce(error);
      await authService.cleanIngredientPantry();
      expect(notifyService.error).toHaveBeenCalledWith('Clean error', { duration: 5000 });
    });
  });

  describe('editIngredientPantry', () => {
    it('should notify success on edit', async () => {
      instance.get.mockResolvedValueOnce({});
      instance.put.mockResolvedValueOnce({ data: { message: 'Updated' } });
      const data = await authService.editIngredientPantry(1, { name: 'Sugar' });
      expect(data).toEqual({ message: 'Updated' });
      expect(notifyService.success).toHaveBeenCalledWith('Updated', { duration: 4000 });
    });

    it('should notify error on failure', async () => {
      instance.get.mockResolvedValueOnce({});
      const error = { response: { data: { message: 'Update failed' } } };
      instance.put.mockRejectedValueOnce(error);
      await authService.editIngredientPantry(1, { name: 'Sugar' });
      expect(notifyService.error).toHaveBeenCalledWith('Update failed', { duration: 5000 });
    });
  });

  describe('getIngredientList', () => {
    it('should return ingredient list', async () => {
      instance.get.mockResolvedValueOnce({});
      instance.get.mockResolvedValueOnce({ data: ['ingredient1', 'ingredient2'] });
      const data = await authService.getIngredientList();
      expect(data).toEqual(['ingredient1', 'ingredient2']);
    });

    it('should notify on 401 error', async () => {
      instance.get.mockResolvedValueOnce({});
      const error = { response: { status: 401 } };
      instance.get.mockRejectedValueOnce(error);
      await expect(authService.getIngredientList()).rejects.toBe(error);
      expect(notifyService.error).toHaveBeenCalledWith('Session expired, please login again', { duration: 5000 });
    });
  });

  describe('addIngredientPantry', () => {
    it('should notify success on add', async () => {
      instance.get.mockResolvedValueOnce({});
      instance.post.mockResolvedValueOnce({ data: { message: 'Added' } });
      const data = await authService.addIngredientPantry({ name: 'Salt' });
      expect(data).toEqual({ message: 'Added' });
      expect(notifyService.success).toHaveBeenCalledWith('Added', { duration: 4000 });
    });

    it('should notify error on failure', async () => {
      instance.get.mockResolvedValueOnce({});
      const error = { response: { data: { message: 'Add error' } } };
      instance.post.mockRejectedValueOnce(error);
      await authService.addIngredientPantry({ name: 'Salt' });
      expect(notifyService.error).toHaveBeenCalledWith('Add error', { duration: 5000 });
    });
  });

  describe('getPublicRecipesByUser', () => {
    it('should return public recipes', async () => {
      instance.get.mockResolvedValueOnce({});
      instance.get.mockResolvedValueOnce({ data: ['publicRecipe'] });
      const data = await authService.getPublicRecipesByUser(1);
      expect(data).toEqual(['publicRecipe']);
    });

    it('should notify on 401 error', async () => {
      instance.get.mockResolvedValueOnce({});
      const error = { response: { status: 401 } };
      instance.get.mockRejectedValueOnce(error);
      const result = await authService.getPublicRecipesByUser(1);
      expect(notifyService.error).toHaveBeenCalledWith('Session expired, please login again', { duration: 5000 });
      expect(result).toBe(error);
    });
  });

  describe('getUserById', () => {
    it('should return user data', async () => {
      instance.get.mockResolvedValueOnce({});
      instance.get.mockResolvedValueOnce({ data: { id: 1, name: 'John' } });
      const data = await authService.getUserById(1);
      expect(data).toEqual({ id: 1, name: 'John' });
    });

    it('should notify on 401 error', async () => {
      instance.get.mockResolvedValueOnce({});
      const error = { response: { status: 401 } };
      instance.get.mockRejectedValueOnce(error);
      const result = await authService.getUserById(1);
      expect(notifyService.error).toHaveBeenCalledWith('Session expired, please login again', { duration: 5000 });
      expect(result).toBe(error);
    });
  });
});
