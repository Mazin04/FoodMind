import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { FaChevronLeft } from "react-icons/fa";
import URLS from "@/constants/urls";

const Terms = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="dark:bg-neutral-900 bg-blue-100 min-h-screen py-10 px-4">
            <div className="max-w-4xl mx-auto bg-blue-50 dark:bg-neutral-800 rounded-xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 z-20 bg-white dark:bg-neutral-800 p-6 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                            {t("terms.title")}
                        </h1>
                        <button
                            onClick={() => navigate(URLS.MAIN)}
                            className="group flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                            aria-label={t("terms.backToHome")}
                        >
                            <FaChevronLeft className="text-lg transform transition-transform duration-300 group-hover:-translate-x-2" />
                            <span className="font-medium">{t("terms.backToHome")}</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-8 space-y-8 text-neutral-700 dark:text-neutral-300">
                    <p className="text-sm italic">{t("terms.updated")}</p>

                    {[
                        "acceptance",
                        "usage",
                        "account",
                        "content",
                        "intellectual",
                        "limitation",
                        "changes",
                        "termination",
                        "law",
                        "contact"
                    ].map((sectionKey) => (
                        <div key={sectionKey}>
                            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                                {t(`terms.${sectionKey}.title`)}
                            </h2>
                            <p className="leading-relaxed">{t(`terms.${sectionKey}.text`)}</p>
                        </div>
                    ))}

                    <div>
                        <a
                            href="mailto:soporte@foodmind.app"
                            className="text-blue-600 dark:text-blue-400 underline mt-2 inline-block"
                        >
                            rubengsegoviano@gmail.com
                        </a>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default Terms;
