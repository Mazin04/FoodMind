import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router";
import { getUser } from "@/features/auth/services/authService";
import PageLoader from "@/shared/components/PageLoader";
import URLS from "@/constants/urls";

const GuestRoutes = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchUser = async () => {
            const isMain = location.pathname === URLS.MAIN;
            try {
                const fetchedUser = await getUser(isMain);
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

    return !user ? <Outlet /> : <Navigate to={URLS.HOME} />;
}

export default GuestRoutes;