import instance from '@/lib/axios';

const withCSRF = async () => {
    try {
        await instance.get('/sanctum/csrf-cookie');
    } catch (error) {
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

export const getUser = async () => {
    try {
        await withCSRF();
        const { data } = await instance.get('/api/user');
        return data;
    } catch (error) {
        throw error;
    }
}

export const logout = async () => {
    try {
        await withCSRF();
        await instance.get('/api/logout');
    } catch (error) {
        throw error;
    }
}