import { useState } from 'react';

function ImageUpload({ register, errors, t, watch }) {
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
        } else {
            setFileName('');
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="recipeImage" className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">
                {t('recipes.create.image')}
            </label>

            <div className="relative flex flex-col justify-center items-center w-full min-h-[5rem] border-2 border-dashed rounded-md transition-colors duration-200
                      border-gray-300 dark:border-neutral-600 hover:border-blue-400 dark:hover:border-blue-300 p-4">
                <input
                    type="file"
                    id="recipeImage"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    {...register('image', {
                        required: true,
                        validate: {
                            fileSize: (fileList) => {
                                const file = fileList?.[0];
                                return !file || file.size <= 2 * 1024 * 1024 || t('recipes.create.imageTooLarge');
                            }
                        },
                        onChange: handleFileChange
                    })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="z-0 flex flex-col items-center justify-center text-sm text-neutral-500 dark:text-neutral-400 pointer-events-none">
                    {fileName ? (
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">{fileName}</p>
                    ) : (
                        <>
                            <p className="font-medium">{t('recipes.create.uploadHint') || 'Haz clic o arrastra una imagen aquí'}</p>
                            <p className="text-xs">{t('recipes.create.imageFormats') || 'Formatos: PNG, JPG, JPEG, WEBP (máx. 2MB)'}</p>
                        </>
                    )}
                </div>
            </div>

            {errors.image && (
                <span className="text-red-500 text-xs">{errors.image.message || t('recipes.create.imageRequired')}</span>
            )}
        </div>
    );
}

export default ImageUpload;
