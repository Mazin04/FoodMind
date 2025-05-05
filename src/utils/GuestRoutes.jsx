import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router";
import { getUser } from "@/services/authService";
import PageLoader from "@/components/PageLoader";
import URLS from "@/constants/urls";

const GuestRoutes = () => {
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

    return !user ? <Outlet /> : <Navigate to={URLS.HOME} />;
}

export default GuestRoutes;