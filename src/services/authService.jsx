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

export const isEmailRegistered = async (email) => {
    try {
        await withCSRF();
        const { data } = await instance.get('/api/email/registered', {
            params: { email },
        });
        return data;
    } catch (error) {
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