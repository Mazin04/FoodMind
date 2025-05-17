import ReactModal from "react-modal";
import { FaWhatsapp, FaFacebook, FaShare } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";
import { useTranslation } from "react-i18next";
const ShareModal = ({
    isOpen,
    onClose,
}) => {
    const { t } = useTranslation();
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Share Modal"
            className="fixed inset-0 z-50 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black/30 backdrop-blur-sm"
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            ariaHideApp={false}
        >
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto space-y-6 m-4 relative">
                <button className="absolute top-2 right-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300" onClick={onClose}>
                    <IoMdCloseCircle
                        style={{ height: 25, width: 25 }}
                        className="text-neutral-500 dark:text-neutral-300 hover:text-red-600"
                    />
                </button>
                <h2 className="text-2xl font-bold text-center text-neutral-800 dark:text-white">
                    {t('share_recipe')}
                </h2>
                <div className="flex flex-col space-y-4">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        {t('share_recipe_description')}
                    </p>
                </div>
                {/* Social Media Share Buttons */}
                <div className="flex flex-row items-center justify-center space-x-4">
                    <button
                        className="bg-blue-500 text-white p-2 hover:bg-blue-600 transition duration-200  rounded-full w-fit"
                        onClick={() => {
                            // Add your share functionality here
                            if (navigator.share) {
                                navigator.share({
                                    title: 'Mira esta receta',
                                    text: '¡Esta receta está genial!',
                                    url: window.location.href,
                                })
                                    .then(() => console.log('Contenido compartido con éxito'))
                                    .catch((error) => console.error('Error al compartir:', error));
                            } else {
                                alert('Tu navegador no soporta la función de compartir.');
                            }
                        }}
                    >
                        <FaShare
                            style={{ height: 25, width: 25 }}
                            className="text-white"
                        />
                    </button>
                    <button
                        className="bg-green-500 text-white p-2 hover:bg-green-600 transition duration-200 rounded-full w-fit"
                        onClick={() => {
                            const url = window.location.href;
                            const text = "¡Mira esta receta!";
                            const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)} ${encodeURIComponent(url)}`;
                            window.open(whatsappUrl, "_blank");
                        }}
                    >
                        <FaWhatsapp
                            style={{ height: 25, width: 25 }}
                        />
                    </button>
                    <button
                        className="bg-black text-white p-2 hover:bg-gray-800 transition duration-200 rounded-full w-fit"
                        onClick={() => {
                            const url = window.location.href;
                            const text = "¡Mira esta receta!";
                            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)} ${encodeURIComponent(url)}`;
                            window.open(twitterUrl, "_blank");
                        }}
                    >
                        <FaXTwitter
                            style={{ height: 25, width: 25 }}
                        />
                    </button>
                    <button
                        className="bg-blue-700 text-white p-2 hover:bg-blue-800 transition duration-200 rounded-full w-fit"
                        onClick={() => {
                            const url = window.location.href;
                            const text = "¡Mira esta receta!";
                            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                            window.open(facebookUrl, "_blank");
                        }}
                    >
                        <FaFacebook
                            style={{ height: 25, width: 25 }}
                        />
                    </button>
                </div>
            </div>
        </ReactModal>
    )
}

export default ShareModal;