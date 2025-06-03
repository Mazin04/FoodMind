const MockAd = ({ height = "250px", width = "100%" }) => {
    return (
        <div
            className="flex items-center justify-center text-xs text-gray-700 dark:text-stone-50 border border-dashed border-gray-400 dark:border-stone-300 rounded-lg dark:bg-neutral-700 bg-blue-50 shadow-sm"
            style={{ height, width }}
        >
            Placeholder for Ads
        </div>
    );
};

export default MockAd;
