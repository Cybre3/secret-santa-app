import React from 'react';
import ErrorMessage from './ErrorMessage';

function CheckBox({ name, label, error, options, ...rest }) {
  return (
    <div className="form-control">
      <h3>{label}</h3>
      {options.map((option) => {
        return (
          <React.Fragment key={option.name}>
            <input {...rest} type="checkbox" id={option.name} value={option.value} name={name} />
            <label htmlFor={name}>{option.value}</label>
          </React.Fragment>
        );
      })}
      <ErrorMessage error={error} />
    </div>
  );
}

export default CheckBox;
