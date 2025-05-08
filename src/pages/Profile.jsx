import { useEffect, useState } from "react";
import { getUser } from "@/services/authService";
import { useTranslation } from "react-i18next";

import bg from "@/assets/images/bg-2.png";
import PageLoader from "@/components/PageLoader.jsx";

const Profile = () => {
    const { t } = useTranslation();

    const [userName, setUserName] = useState("User");
    const [, setAvatar] = useState(null);
    const [placeholder, setPlaceholder] = useState(null);
    const [finalAvatar, setFinalAvatar] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const user = await getUser();
                const placeholderUrl = `https://avatar.iran.liara.run/username?username=${user.name}`;
                const avatarUrl = user.avatar && user.avatar.trim() !== "" ? user.avatar : null;

                setUserName(user.name);
                setPlaceholder(placeholderUrl);
                setAvatar(avatarUrl);
                setFinalAvatar(avatarUrl || placeholderUrl);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);


    return (
        <>
            {loading ? (
                <PageLoader/>
            ) : (
            <div className="h-full w-full flex flex-col items-center justify-start text-neutral-900 dark:text-white">
                <div
                    className="relative h-52 sm:h-72 md:h-84 w-full border-b-1 border-neutral-700 dark:border-neutral-500"
                    style={{
                        backgroundImage: `url(${bg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    <div className="absolute inset-0 bg-black/50" /> {/* Opcional overlay semitransparente */}

                    <div className="absolute bottom-[-25px] md:bottom-[-40px] left-5 md:left-10 z-20 w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-white bg-gray-200">
                        {!loading && finalAvatar && (
                            <img
                                src={finalAvatar}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover transition-opacity duration-500 opacity-0"
                                onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
                                onError={(e) => {
                                    if (e.target.src !== placeholder) {
                                        setFinalAvatar(placeholder);
                                    }
                                }}
                            />
                        )}
                    </div>

                    <p className="absolute bottom-0 left-20 md:left-40 text-white font-bold text-md md:text-lg lg:text-xl xl:text-2xl p-1 bg-black/50 px-10 rounded-tr-xl">
                        {userName}
                    </p>
                </div>
            </div>
            )}
        </>
    );
}

export default Profile;