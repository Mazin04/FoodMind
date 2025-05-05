import w_logo from '@/assets/images/logos/Logo_w_mode.png';
import b_logo from '@/assets/images/logos/Logo_b_mode.png';
import { useTheme } from '@/context/ThemeContext';

function PageLoader() {
  const { isDarkMode } = useTheme();
  return (
    <>
      <div className="dark:bg-neutral-900 bg-stone-100 h-screen flex flex-col justify-center items-center">
        <img
          src={isDarkMode ? b_logo : w_logo}
          alt="Logo loader"
          className="loader-logo not-draggable w-48 transition-transform duration-500 ease-in-out animate-pulse"
        />
      </div>
    </>
  );
}

export default PageLoader;