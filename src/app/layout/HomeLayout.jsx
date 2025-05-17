import Navbar from '@/shared/components/Navbar';
import { Outlet } from 'react-router';

function HomeLayout() {

    return (
        <div className="w-full h-screen bg-stone-100 dark:bg-neutral-900 flex">
            <div className="min-w-[70px] sm:basis-[90px] xl:basis-[20%] 2xl:basis-[25%] flex-shrink-0">
                <Navbar />
            </div>

            <div className="flex flex-col 2xl:basis-[50%] flex-grow xl:flex-row overflow-hidden">
                <div className="w-full h-full flex-1 bg-stone-100 dark:bg-neutral-900 flex justify-center items-center">
                    <Outlet />
                </div>
            </div>
            <div className="hidden 2xl:flex w-full h-full basis-[25%] bg-stone-100 dark:bg-neutral-900 justify-center items-center">
                {/* Side content */}
                <div className="w-full h-full flex justify-center items-center bg-red-200">
                </div>
            </div>
        </div>
    );
}

export default HomeLayout;
