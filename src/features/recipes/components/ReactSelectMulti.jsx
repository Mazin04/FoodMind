import Select from 'react-select';
import { useTheme } from '@/shared/context/ThemeContext';

const ReactSelectMulti = ({ options, value, onChange, placeholder, error }) => {
    const { isDarkMode } = useTheme();

    const customStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: isDarkMode ? '#353535' : 'transparent',
            borderColor: error ? 'red' : state.isFocused ? '#60a5fa' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 1px #60a5fa' : 'none',
            '&:hover': {
                borderColor: '#60a5fa'
            },
            color: isDarkMode ? '#fff' : '#000'
        }),
        menu: (base) => ({
            ...base,
            zIndex: 20,
            backgroundColor: isDarkMode ? '#262626' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: '#2b7fff',
            color: '#fff'
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#fff',
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#fff',
            ':hover': {
                backgroundColor: '#1e3a8a',
                color: '#fff'
            }
        }),
        option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected
                ? '#3b82f6'
                : isFocused
                    ? (isDarkMode ? '#4b5563' : '#e5e7eb')
                    : 'transparent',
            color: isSelected ? '#fff' : (isDarkMode ? '#f9fafb' : '#111827'),
            ':active': {
                backgroundColor: '#3b82f6',
                color: '#fff'
            }
        }),
        placeholder: (base) => ({
            ...base,
            color: isDarkMode ? '#9ca3af' : '#6b7280'
        }),
        singleValue: (base) => ({
            ...base,
            color: isDarkMode ? '#fff' : '#000'
        }),
    };

    return (
        <Select
            options={options}
            isMulti
            value={value}
            onChange={(selected) => {
                if (!selected || selected.length <= 3) {
                    onChange(selected);
                }
            }}
            getOptionLabel={(e) => e.name}
            getOptionValue={(e) => e.id.toString()}
            placeholder={placeholder}
            styles={customStyles}
            className="text-sm dark:text-white"
            classNamePrefix="react-select"
            closeMenuOnSelect={false}
        />
    );
};

export default ReactSelectMulti;