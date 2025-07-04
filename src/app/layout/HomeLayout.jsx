import Navbar from '@/shared/components/Navbar';
import { Outlet } from 'react-router';
import MockAd from '@/shared/components/MockAd';
import NavbarSmall from '@/shared/components/NavbarSmall';
function HomeLayout() {

    return (
        <div className="w-full h-screen flex flex-col sm:flex-row">
            <div className="min-w-[70px] hidden sm:block sm:basis-[90px] xl:basis-[20%] 2xl:basis-[25%] flex-shrink-0">
                <Navbar />
            </div>

            <div className="flex flex-col 2xl:basis-[50%] flex-grow xl:flex-row overflow-hidden">
                <div className="w-full h-full flex-1 bg-blue-100 dark:bg-neutral-900 flex justify-center items-center">
                    <Outlet />
                </div>
            </div>
            <div className="hidden 2xl:flex w-full h-full basis-[25%] bg-stone-100 dark:bg-neutral-900 justify-center items-center">
                {/* Side content */}
                <div className="w-full h-full flex-1 bg-blue-100 dark:bg-neutral-900 flex justify-center items-center border-l-1 border-neutral-700">
                    <MockAd height="50%" width="80%" />
                </div>
            </div>

            {/* Navbar at the bottom for small screens */}
            <div className="block sm:hidden w-full h-[70px] border-t border-neutral-700">
                <NavbarSmall />
            </div>
        </div>
    );
}

export default HomeLayout;
