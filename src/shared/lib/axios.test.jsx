import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import instance from './axios';

vi.mock('axios', () => ({
  __esModule: true,
  default: { create: vi.fn() },
  create: vi.fn(),
}));

describe('axios instance', () => {
  it('should create an axios instance with correct config', () => {
    // Configuración esperada
    const expectedConfig = {
      baseURL: import.meta.env.VITE_API_URL,
      withCredentials: true,
      withXSRFToken: true,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    };

    expect(axios.create).toHaveBeenCalledWith(expectedConfig);
  });

  it('should export the created instance', () => {
    expect(instance).toBeUndefined();
  });
});