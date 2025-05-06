import Navbar from '@/components/Navbar';
import { Outlet } from 'react-router';

function HomeLayout() {

    return (
        <div className="w-full h-screen bg-stone-100 dark:bg-neutral-900 flex">
            <div className="min-w-[90px] basis-[90px] xl:basis-[20%] 2xl:basis-[28%] flex-shrink-0">
                <Navbar/>
            </div>

            <div className="flex-grow flex flex-col xl:flex-row">
                <div className="w-full h-full flex-1 bg-stone-100 dark:bg-neutral-900 flex justify-center items-center">
                    <Outlet />
                </div>

                <div className="hidden 2xl:flex w-full h-full basis-[35%] bg-stone-100 dark:bg-neutral-900 justify-center items-center">
                    {/* Side content */}
                    <div className="w-full h-full flex justify-center items-center bg-red-200">
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeLayout;
