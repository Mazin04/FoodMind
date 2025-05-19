import ReactModal from 'react-modal';
import { MoonLoader } from "react-spinners";

const ConfirmationModal = ({
  isOpen,
  onCancel,
  onConfirm,
  loading,
  title,
  subtitle,
  cancelText = "Cancel",
  confirmText = "Confirm"
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onCancel}
      contentLabel="Confirmation Modal"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black/20 backdrop-blur-sm"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      ariaHideApp={false}
    >
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md max-w-md sm:w-[80%] max-h-[90vh] overflow-y-auto space-y-5 m-4">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-white text-center break-words">{title}</h2>
        <p className="text-neutral-500 font-semibold dark:text-neutral-400 text-center break-words whitespace-pre-wrap">{subtitle}</p>

        {loading ? (
          <div className="flex justify-center items-center">
            <MoonLoader size={24} color="#4A90E2" />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              className="bg-blue-500 text-white py-2 px-4 w-full rounded-md hover:bg-blue-700 transition duration-200 break-words"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 w-full rounded-md hover:bg-red-700 transition duration-200 break-words"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </ReactModal>
  );
};

export default ConfirmationModal;
