import Navbar from '@/components/Navbar';

function Home() {
    return (
        <div className="w-full h-screen bg-stone-100 dark:bg-neutral-900 flex">
            <div className="min-w-[90px] basis-[90px] xl:basis-[20%] 2xl:basis-[28%] flex-shrink-0">
                <Navbar />
            </div>

            <div className="flex-grow flex flex-col xl:flex-row">
                <div className="w-full h-full flex-1 bg-stone-100 dark:bg-neutral-900 flex justify-center items-center">
                    {/* Main content */}
                </div>

                <div className="hidden 2xl:flex w-full h-full basis-[20%] bg-stone-100 dark:bg-neutral-900 justify-center items-center">
                    {/* Side content */}
                </div>
            </div>
        </div>
    );
}

export default Home;
