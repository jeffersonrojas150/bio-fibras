import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';

// Este es nuestro nuevo componente de dropdown personalizado
const CustomSortDropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedOption = options.find(option => option.value === value);

  // Hook para cerrar el dropdown si se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="custom-sort-dropdown" ref={wrapperRef}>
      <div className="sort-selected-value" onClick={() => setIsOpen(!isOpen)}>
        {selectedOption ? selectedOption.label : 'Seleccionar...'}
        <FaChevronDown className={`chevron-icon ${isOpen ? 'open' : ''}`} />
      </div>

      {isOpen && (
        <ul className="options-list">
          {options.map(option => (
            <li
              key={option.value}
              className={`option-item ${option.value === value ? 'active' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSortDropdown;