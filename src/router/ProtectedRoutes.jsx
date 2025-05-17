import { Outlet, Navigate } from "react-router";
import { getUser } from "@/features/auth/services/authService";

import { useState, useEffect } from "react";
import PageLoader from "@/shared/components/PageLoader";

const ProtectedRoutes = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const fetchedUser = await getUser();
                setUser(fetchedUser);
            } catch (error) {
                // Do nothing, the user is not logged in
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) return <PageLoader/>;

    return user ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoutes;