import { use, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserPantry } from '@/services/authService';
const Pantry = () => {
    const { t } = useTranslation();

    const [userPantry, setUserPantry] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const pantry = await getUserPantry();
                console.log("User pantry:", pantry);
                setUserPantry(pantry);
            } catch (error) {
                console.error("Error fetching user pantry:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            {loading ? (
                <p className="text-lg text-gray-500">Loading...</p>
            ) : (
                <div className="w-full max-w-2xl  shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Pantry:</h2>
                    {Array.isArray(userPantry) && userPantry.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {userPantry.map((item, index) => (
                                <li key={index} className="py-4 flex justify-between items-center space-x-10">
                                    <span className="text-gray-800 font-medium">{item.name}</span>
                                    <span className="text-gray-600">{item.quantity} {t(item.unit)}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">Your pantry is empty.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Pantry;