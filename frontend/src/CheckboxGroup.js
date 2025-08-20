import React, { useState } from 'react';

const CheckboxGroup = ({title, options, selected, onChange }) => {
  const handleCheckboxChange = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className='member-group'>
      {options.map((option) => (
        <div key={option.value} className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id={`${title}-${option.value}`}
            checked={selected.includes(option.value)}
            onChange={() => handleCheckboxChange(option.value)}
          />
          <label className="form-check-label" htmlFor={`${title}-${option.value}`}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};
export default CheckboxGroup;